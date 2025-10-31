# Event-Driven Architecture

This file covers event-driven architecture patterns, implementation strategies, and best practices.

## Core Concepts

### Events vs Messages

- **Events**: Something that happened in the past (immutable)
- **Commands**: Instructions to do something (imperative)
- **Queries**: Requests for information (interrogative)

### Event Types

```java
// Domain Event
public class OrderCreatedEvent extends DomainEvent {
    private final String orderId;
    private final String customerId;
    private final BigDecimal totalAmount;
    private final LocalDateTime createdAt;

    public OrderCreatedEvent(String orderId, String customerId, BigDecimal totalAmount) {
        super();
        this.orderId = orderId;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.createdAt = LocalDateTime.now();
    }

    // Getters
}

// Integration Event
public class CustomerRegisteredEvent {
    private final String customerId;
    private final String email;
    private final String firstName;
    private final String lastName;

    // Constructor and getters
}
```

## Event Sourcing

### Implementation

```java
// Event Store
@Entity
@Table(name = "event_store")
public class EventStoreEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stream_id")
    private String streamId;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "event_data", columnDefinition = "TEXT")
    private String eventData;

    @Column(name = "event_version")
    private Long version;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Constructors, getters, setters
}

// Event Store Repository
@Repository
public class EventStore {
    private final EventStoreRepository repository;
    private final ObjectMapper objectMapper;

    public void saveEvents(String streamId, List<DomainEvent> events, Long expectedVersion) {
        Long currentVersion = getLastVersion(streamId);

        if (!Objects.equals(currentVersion, expectedVersion)) {
            throw new ConcurrencyException("Stream has been modified");
        }

        for (int i = 0; i < events.size(); i++) {
            DomainEvent event = events.get(i);
            EventStoreEntry entry = new EventStoreEntry();
            entry.setStreamId(streamId);
            entry.setEventType(event.getClass().getSimpleName());
            entry.setEventData(serialize(event));
            entry.setVersion(currentVersion + i + 1);
            entry.setTimestamp(LocalDateTime.now());

            repository.save(entry);
        }
    }

    public List<DomainEvent> getEvents(String streamId) {
        List<EventStoreEntry> entries = repository.findByStreamIdOrderByVersion(streamId);

        return entries.stream()
            .map(this::deserialize)
            .collect(Collectors.toList());
    }

    public List<DomainEvent> getEvents(String streamId, Long fromVersion) {
        List<EventStoreEntry> entries = repository
            .findByStreamIdAndVersionGreaterThanOrderByVersion(streamId, fromVersion);

        return entries.stream()
            .map(this::deserialize)
            .collect(Collectors.toList());
    }
}

// Aggregate Root with Event Sourcing
public abstract class AggregateRoot {
    private String id;
    private Long version;
    private final List<DomainEvent> uncommittedEvents = new ArrayList<>();

    protected void applyEvent(DomainEvent event) {
        applyChange(event, true);
    }

    public void markEventsAsCommitted() {
        uncommittedEvents.clear();
    }

    public void loadFromHistory(List<DomainEvent> history) {
        for (DomainEvent event : history) {
            applyChange(event, false);
            version++;
        }
    }

    private void applyChange(DomainEvent event, boolean isNew) {
        // Apply event to current state using reflection or visitor pattern
        apply(event);

        if (isNew) {
            uncommittedEvents.add(event);
        }
    }

    protected abstract void apply(DomainEvent event);

    public List<DomainEvent> getUncommittedEvents() {
        return Collections.unmodifiableList(uncommittedEvents);
    }

    // Getters and setters
}

// Order Aggregate
public class Order extends AggregateRoot {
    private OrderStatus status;
    private String customerId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;

    public Order() {
        // Default constructor for framework
    }

    public Order(String customerId, List<OrderItem> items) {
        setId(UUID.randomUUID().toString());
        this.customerId = customerId;
        this.items = new ArrayList<>(items);
        this.status = OrderStatus.DRAFT;
        this.totalAmount = calculateTotal();

        applyEvent(new OrderCreatedEvent(getId(), customerId, totalAmount));
    }

    public void confirm() {
        if (status != OrderStatus.DRAFT) {
            throw new IllegalStateException("Only draft orders can be confirmed");
        }

        this.status = OrderStatus.CONFIRMED;
        applyEvent(new OrderConfirmedEvent(getId()));
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof OrderCreatedEvent) {
            apply((OrderCreatedEvent) event);
        } else if (event instanceof OrderConfirmedEvent) {
            apply((OrderConfirmedEvent) event);
        }
        // Handle other events
    }

    private void apply(OrderCreatedEvent event) {
        setId(event.getOrderId());
        this.customerId = event.getCustomerId();
        this.totalAmount = event.getTotalAmount();
        this.status = OrderStatus.DRAFT;
    }

    private void apply(OrderConfirmedEvent event) {
        this.status = OrderStatus.CONFIRMED;
    }
}
```

## CQRS (Command Query Responsibility Segregation)

### Command Side

```java
// Commands
public interface Command {
    String getAggregateId();
}

public class CreateOrderCommand implements Command {
    private final String orderId;
    private final String customerId;
    private final List<OrderItemData> items;

    // Constructor and getters

    @Override
    public String getAggregateId() {
        return orderId;
    }
}

// Command Handlers
@Component
public class OrderCommandHandler {
    private final EventStore eventStore;

    @CommandHandler
    public void handle(CreateOrderCommand command) {
        List<OrderItem> items = command.getItems().stream()
            .map(data -> new OrderItem(data.getProductId(), data.getQuantity(), data.getPrice()))
            .collect(Collectors.toList());

        Order order = new Order(command.getCustomerId(), items);

        eventStore.saveEvents(
            order.getId(),
            order.getUncommittedEvents(),
            order.getVersion()
        );

        order.markEventsAsCommitted();
    }

    @CommandHandler
    public void handle(ConfirmOrderCommand command) {
        List<DomainEvent> events = eventStore.getEvents(command.getOrderId());
        Order order = new Order();
        order.loadFromHistory(events);

        order.confirm();

        eventStore.saveEvents(
            order.getId(),
            order.getUncommittedEvents(),
            order.getVersion()
        );
    }
}
```

### Query Side

```java
// Read Models
@Entity
@Table(name = "order_view")
public class OrderView {
    @Id
    private String orderId;
    private String customerId;
    private String customerName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;

    // Constructors, getters, setters
}

// Projection Handlers (Event Handlers for Read Side)
@Component
public class OrderProjectionHandler {
    private final OrderViewRepository repository;

    @EventHandler
    public void on(OrderCreatedEvent event) {
        OrderView view = new OrderView();
        view.setOrderId(event.getOrderId());
        view.setCustomerId(event.getCustomerId());
        view.setTotalAmount(event.getTotalAmount());
        view.setStatus("DRAFT");
        view.setCreatedAt(event.getOccurredOn());

        repository.save(view);
    }

    @EventHandler
    public void on(OrderConfirmedEvent event) {
        OrderView view = repository.findById(event.getOrderId())
            .orElseThrow(() -> new IllegalStateException("Order view not found"));

        view.setStatus("CONFIRMED");
        view.setConfirmedAt(event.getOccurredOn());

        repository.save(view);
    }

    @EventHandler
    public void on(CustomerRegisteredEvent event) {
        // Update customer name in all order views
        List<OrderView> orders = repository.findByCustomerId(event.getCustomerId());
        orders.forEach(order -> {
            order.setCustomerName(event.getFirstName() + " " + event.getLastName());
            repository.save(order);
        });
    }
}

// Query Handlers
@Component
public class OrderQueryHandler {
    private final OrderViewRepository repository;

    public Optional<OrderView> findById(String orderId) {
        return repository.findById(orderId);
    }

    public List<OrderView> findByCustomerId(String customerId) {
        return repository.findByCustomerId(customerId);
    }

    public Page<OrderView> findByStatus(String status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }
}
```

## Event Streaming with Kafka

### Producer Configuration

```java
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        configProps.put(ProducerConfig.ACKS_CONFIG, "all");
        configProps.put(ProducerConfig.RETRIES_CONFIG, 3);
        configProps.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        configProps.put(ProducerConfig.LINGER_MS_CONFIG, 5);

        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}

// Event Publisher
@Component
public class EventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(DomainEvent event) {
        String topic = getTopicName(event);
        String key = event.getAggregateId();

        kafkaTemplate.send(topic, key, event)
            .addCallback(
                result -> log.info("Event published successfully: {}", event),
                failure -> log.error("Failed to publish event: {}", event, failure)
            );
    }

    private String getTopicName(DomainEvent event) {
        return "events." + event.getClass().getSimpleName().toLowerCase();
    }
}
```

### Consumer Configuration

```java
@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");

        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);
        factory.setRetryTemplate(retryTemplate());
        factory.setErrorHandler(new SeekToCurrentErrorHandler());

        return factory;
    }

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(1000L);
        retryTemplate.setBackOffPolicy(backOffPolicy);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);

        return retryTemplate;
    }
}

// Event Listeners
@Component
public class OrderEventListener {

    @KafkaListener(topics = "events.customerwelcomed")
    public void handleCustomerWelcomed(CustomerWelcomedEvent event) {
        log.info("Customer welcomed: {}", event.getCustomerId());
        // Send welcome email or perform other actions
    }

    @KafkaListener(topics = "events.inventoryreserved")
    public void handleInventoryReserved(InventoryReservedEvent event) {
        log.info("Inventory reserved for order: {}", event.getOrderId());
        // Continue with order processing
    }
}
```

## Saga Pattern for Process Management

### Orchestration-based Saga

```java
@Component
public class OrderProcessSaga {
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    @SagaOrchestrationStart
    public void processOrder(OrderCreatedEvent event) {
        SagaTransaction saga = SagaTransaction.builder()
            .step("reserve-inventory")
                .action(() -> inventoryService.reserve(event.getOrderId()))
                .compensation(() -> inventoryService.release(event.getOrderId()))
            .step("process-payment")
                .action(() -> paymentService.charge(event.getOrderId()))
                .compensation(() -> paymentService.refund(event.getOrderId()))
            .step("send-confirmation")
                .action(() -> notificationService.sendConfirmation(event.getOrderId()))
                .compensation(() -> notificationService.sendCancellation(event.getOrderId()))
            .build();

        saga.execute();
    }
}
```

### Choreography-based Saga

```java
// Each service handles its own compensation
@Component
public class InventoryService {

    @EventHandler
    public void on(OrderCreatedEvent event) {
        try {
            reserve(event.getOrderId(), event.getItems());
            eventPublisher.publish(new InventoryReservedEvent(event.getOrderId()));
        } catch (InsufficientInventoryException e) {
            eventPublisher.publish(new InventoryReservationFailedEvent(event.getOrderId(), e.getMessage()));
        }
    }

    @EventHandler
    public void on(OrderCancelledEvent event) {
        release(event.getOrderId());
        eventPublisher.publish(new InventoryReleasedEvent(event.getOrderId()));
    }
}

@Component
public class PaymentService {

    @EventHandler
    public void on(InventoryReservedEvent event) {
        try {
            charge(event.getOrderId());
            eventPublisher.publish(new PaymentProcessedEvent(event.getOrderId()));
        } catch (PaymentException e) {
            eventPublisher.publish(new PaymentFailedEvent(event.getOrderId(), e.getMessage()));
            // Trigger compensation
            eventPublisher.publish(new OrderCancelledEvent(event.getOrderId()));
        }
    }
}
```

## Event Store Snapshots

### Snapshot Implementation

```java
@Entity
@Table(name = "snapshots")
public class Snapshot {
    @Id
    private String aggregateId;

    @Column(name = "aggregate_type")
    private String aggregateType;

    @Column(name = "data", columnDefinition = "TEXT")
    private String data;

    @Column(name = "version")
    private Long version;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Constructors, getters, setters
}

public class SnapshotStore {
    private final SnapshotRepository repository;
    private final ObjectMapper objectMapper;

    public void saveSnapshot(AggregateRoot aggregate) {
        Snapshot snapshot = new Snapshot();
        snapshot.setAggregateId(aggregate.getId());
        snapshot.setAggregateType(aggregate.getClass().getSimpleName());
        snapshot.setData(serialize(aggregate));
        snapshot.setVersion(aggregate.getVersion());
        snapshot.setTimestamp(LocalDateTime.now());

        repository.save(snapshot);
    }

    public <T extends AggregateRoot> Optional<T> loadSnapshot(String aggregateId, Class<T> aggregateType) {
        return repository.findByAggregateIdAndAggregateType(aggregateId, aggregateType.getSimpleName())
            .map(snapshot -> deserialize(snapshot.getData(), aggregateType));
    }
}

// Loading with snapshots
public class AggregateRepository<T extends AggregateRoot> {
    private final EventStore eventStore;
    private final SnapshotStore snapshotStore;

    public T load(String aggregateId, Class<T> aggregateType) {
        // Try to load from snapshot first
        Optional<T> snapshot = snapshotStore.loadSnapshot(aggregateId, aggregateType);

        if (snapshot.isPresent()) {
            T aggregate = snapshot.get();
            // Load events after snapshot
            List<DomainEvent> events = eventStore.getEvents(aggregateId, aggregate.getVersion());
            aggregate.loadFromHistory(events);
            return aggregate;
        } else {
            // Load all events
            List<DomainEvent> events = eventStore.getEvents(aggregateId);
            T aggregate = createInstance(aggregateType);
            aggregate.loadFromHistory(events);
            return aggregate;
        }
    }
}
```

## Best Practices

### Event Design

1. **Immutable Events**: Events should never change
2. **Rich Events**: Include enough data to avoid querying
3. **Business Language**: Use domain terminology
4. **Versioning**: Plan for event schema evolution

### Performance Considerations

1. **Snapshots**: For aggregates with many events
2. **Projections**: Pre-computed views for queries
3. **Caching**: Cache frequently accessed data
4. **Async Processing**: Handle events asynchronously when possible

### Error Handling

1. **Idempotency**: Handle duplicate events gracefully
2. **Dead Letter Queues**: For failed events
3. **Monitoring**: Track event processing metrics
4. **Compensation**: Plan for failure scenarios

Event-driven architecture enables scalable, resilient systems but requires careful design and operational practices.
