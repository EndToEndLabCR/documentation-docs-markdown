# Architectural Styles

This file explores different architectural styles and their applications in modern software development.

## Monolithic Architecture

### Overview
A monolithic architecture deploys all application components as a single deployable unit.

### Characteristics
- Single deployable artifact
- Shared database
- Centralized business logic
- Direct in-process communication

### Example Structure
```
monolithic-app/
├── src/
│   ├── controllers/
│   │   ├── UserController.java
│   │   ├── OrderController.java
│   │   └── ProductController.java
│   ├── services/
│   │   ├── UserService.java
│   │   ├── OrderService.java
│   │   └── ProductService.java
│   ├── repositories/
│   │   ├── UserRepository.java
│   │   ├── OrderRepository.java
│   │   └── ProductRepository.java
│   └── models/
│       ├── User.java
│       ├── Order.java
│       └── Product.java
├── database/
│   └── schema.sql
└── config/
    └── application.properties
```

### Advantages
- **Simple deployment**: Single artifact to deploy
- **Easy testing**: Everything runs in one process
- **Simple debugging**: All code in one place
- **No network latency**: Direct method calls
- **ACID transactions**: Easy to maintain consistency

### Disadvantages
- **Technology lock-in**: Entire app uses same stack
- **Scaling limitations**: Must scale entire application
- **Development bottlenecks**: Large teams working on same codebase
- **Fault tolerance**: Single point of failure
- **Deployment risk**: Changes affect entire system

### When to Use
- Small to medium applications
- Simple business domains
- Small development teams
- Rapid prototyping
- Applications with strong consistency requirements

### Implementation Example
```java
@SpringBootApplication
public class ECommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ECommerceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api")
public class ECommerceController {
    private final UserService userService;
    private final OrderService orderService;
    private final ProductService productService;
    
    // All business logic in one application
    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        User user = userService.findById(request.getUserId());
        Product product = productService.findById(request.getProductId());
        
        // Direct method calls - no network overhead
        Order order = orderService.createOrder(user, product, request.getQuantity());
        
        return ResponseEntity.ok(order);
    }
}
```

## Microservices Architecture

### Overview
Microservices architecture structures an application as a collection of loosely coupled, independently deployable services.

### Characteristics
- Service per business capability
- Decentralized governance
- Independent deployment
- Technology diversity
- Failure isolation

### Example Structure
```
microservices-ecommerce/
├── user-service/
│   ├── src/main/java/
│   ├── Dockerfile
│   └── k8s/
├── order-service/
│   ├── src/main/java/
│   ├── Dockerfile
│   └── k8s/
├── product-service/
│   ├── src/main/java/
│   ├── Dockerfile
│   └── k8s/
├── notification-service/
│   ├── src/main/java/
│   ├── Dockerfile
│   └── k8s/
├── api-gateway/
│   ├── src/main/java/
│   ├── Dockerfile
│   └── k8s/
└── docker-compose.yml
```

### Service Communication Patterns

#### Synchronous Communication
```java
// Order Service calling User Service
@Service
public class OrderService {
    private final UserServiceClient userServiceClient;
    
    @Autowired
    public OrderService(UserServiceClient userServiceClient) {
        this.userServiceClient = userServiceClient;
    }
    
    public Order createOrder(CreateOrderRequest request) {
        // Call User Service via HTTP
        User user = userServiceClient.getUser(request.getUserId());
        
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        
        Order order = new Order();
        order.setUserId(user.getId());
        order.setUserEmail(user.getEmail());
        // ... order creation logic
        
        return orderRepository.save(order);
    }
}

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
}
```

#### Asynchronous Communication
```java
// Event-driven communication using RabbitMQ
@Service
public class OrderService {
    private final RabbitTemplate rabbitTemplate;
    
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        // ... order creation logic
        Order savedOrder = orderRepository.save(order);
        
        // Publish event asynchronously
        OrderCreatedEvent event = new OrderCreatedEvent(
            savedOrder.getId(),
            savedOrder.getUserId(),
            savedOrder.getTotalAmount()
        );
        
        rabbitTemplate.convertAndSend("order.exchange", "order.created", event);
        
        return savedOrder;
    }
}

// Notification Service listening to events
@RabbitListener(queues = "notification.order.created")
@Service
public class NotificationService {
    
    @RabbitHandler
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Send notification asynchronously
        sendOrderConfirmationEmail(event.getUserId(), event.getOrderId());
    }
    
    private void sendOrderConfirmationEmail(Long userId, Long orderId) {
        // Email sending logic
        System.out.println("Sending order confirmation for order: " + orderId);
    }
}
```

### Advantages
- **Technology diversity**: Each service can use different technologies
- **Independent scaling**: Scale services independently
- **Fault isolation**: Failure in one service doesn't bring down others
- **Team autonomy**: Teams can work independently
- **Faster deployment**: Deploy services independently

### Disadvantages
- **Distributed system complexity**: Network calls, latency, failures
- **Data consistency**: Managing transactions across services
- **Testing complexity**: Integration testing is harder
- **Operational overhead**: More services to monitor and maintain
- **Development overhead**: Service discovery, configuration management

### When to Use
- Large, complex applications
- Multiple development teams
- Different scaling requirements per component
- Need for technology diversity
- Organizations with DevOps maturity

## Service-Oriented Architecture (SOA)

### Overview
SOA is an architectural pattern where application components provide services through well-defined interfaces.

### Characteristics
- Service contracts and interfaces
- Service registry and discovery
- Loose coupling
- Service composition
- Platform independence

### SOA vs Microservices
| Aspect | SOA | Microservices |
|--------|-----|---------------|
| Service Size | Larger services | Small, focused services |
| Communication | SOAP, ESB | HTTP/REST, messaging |
| Data Sharing | Shared databases | Database per service |
| Governance | Centralized | Decentralized |

### Implementation Example
```java
// Service Interface
@WebService
public interface UserService {
    @WebMethod
    User getUserById(@WebParam(name = "userId") Long userId);
    
    @WebMethod
    User createUser(@WebParam(name = "userData") UserData userData);
}

// Service Implementation
@WebService(endpointInterface = "com.example.UserService")
@Service
public class UserServiceImpl implements UserService {
    
    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    
    @Override
    public User createUser(UserData userData) {
        User user = new User();
        user.setFirstName(userData.getFirstName());
        user.setLastName(userData.getLastName());
        user.setEmail(userData.getEmail());
        
        return userRepository.save(user);
    }
}

// Service Configuration
@Configuration
@EnableWs
public class WebServiceConfig extends WsConfigurerAdapter {
    
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }
    
    @Bean(name = "users")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema usersSchema) {
        DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
        wsdl11Definition.setPortTypeName("UsersPort");
        wsdl11Definition.setLocationUri("/ws");
        wsdl11Definition.setTargetNamespace("http://example.com/users");
        wsdl11Definition.setSchema(usersSchema);
        return wsdl11Definition;
    }
}
```

## Serverless Architecture

### Overview
Serverless architecture runs applications in stateless compute containers managed by cloud providers.

### Characteristics
- No server management
- Event-driven execution
- Automatic scaling
- Pay-per-execution
- Stateless functions

### AWS Lambda Example
```java
public class OrderProcessorHandler implements RequestHandler<SQSEvent, String> {
    
    private final OrderService orderService = new OrderService();
    
    @Override
    public String handleRequest(SQSEvent event, Context context) {
        LambdaLogger logger = context.getLogger();
        
        for (SQSEvent.SQSMessage record : event.getRecords()) {
            try {
                OrderEvent orderEvent = parseOrderEvent(record.getBody());
                processOrder(orderEvent);
                
                logger.log("Processed order: " + orderEvent.getOrderId());
            } catch (Exception e) {
                logger.log("Error processing order: " + e.getMessage());
                throw new RuntimeException(e);
            }
        }
        
        return "Successfully processed " + event.getRecords().size() + " orders";
    }
    
    private OrderEvent parseOrderEvent(String body) {
        // Parse JSON to OrderEvent
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(body, OrderEvent.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse order event", e);
        }
    }
    
    private void processOrder(OrderEvent event) {
        // Business logic for order processing
        orderService.processOrder(event.getOrderId());
    }
}
```

### Serverless Framework Configuration
```yaml
# serverless.yml
service: order-processing

provider:
  name: aws
  runtime: java11
  stage: ${opt:stage, 'dev'}
  region: us-east-1
  
functions:
  processOrder:
    handler: com.example.OrderProcessorHandler
    events:
      - sqs:
          arn: !GetAtt OrderQueue.Arn
          batchSize: 10
    environment:
      DB_URL: ${env:DB_URL}
      
  orderAPI:
    handler: com.example.OrderAPIHandler
    events:
      - http:
          path: /orders
          method: post
      - http:
          path: /orders/{id}
          method: get

resources:
  Resources:
    OrderQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: order-processing-queue
```

### Advantages
- **No infrastructure management**: Focus on business logic
- **Automatic scaling**: Scales with demand
- **Cost effective**: Pay only for execution time
- **High availability**: Built-in fault tolerance
- **Fast deployment**: Quick to deploy functions

### Disadvantages
- **Cold start latency**: Initial execution delay
- **Execution limits**: Time and memory constraints
- **Vendor lock-in**: Platform-specific implementations
- **Limited local testing**: Hard to replicate cloud environment
- **Debugging complexity**: Distributed logging and monitoring

## Event-Driven Architecture

### Overview
Event-driven architecture uses events to trigger and communicate between decoupled services.

### Components
- **Event Producers**: Generate events
- **Event Routers**: Route events to consumers
- **Event Consumers**: Process events
- **Event Store**: Persist events

### Implementation Patterns

#### Event Sourcing
```java
// Event Store
@Entity
@Table(name = "events")
public class EventStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "aggregate_id")
    private String aggregateId;
    
    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "event_data")
    private String eventData;
    
    @Column(name = "version")
    private Long version;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    // Constructors, getters, setters
}

// Event sourcing for User aggregate
@Service
public class UserEventStore {
    private final EventStoreRepository repository;
    private final ObjectMapper objectMapper;
    
    public void saveEvent(String aggregateId, DomainEvent event) {
        EventStore eventStore = new EventStore();
        eventStore.setAggregateId(aggregateId);
        eventStore.setEventType(event.getClass().getSimpleName());
        eventStore.setEventData(objectMapper.writeValueAsString(event));
        eventStore.setTimestamp(LocalDateTime.now());
        
        repository.save(eventStore);
    }
    
    public List<DomainEvent> getEvents(String aggregateId) {
        List<EventStore> events = repository.findByAggregateIdOrderByVersion(aggregateId);
        
        return events.stream()
            .map(this::deserializeEvent)
            .collect(Collectors.toList());
    }
    
    public User rebuildAggregate(String userId) {
        List<DomainEvent> events = getEvents(userId);
        User user = new User();
        
        for (DomainEvent event : events) {
            user.apply(event);
        }
        
        return user;
    }
}

// Domain Events
public abstract class DomainEvent {
    private final String eventId;
    private final LocalDateTime occurredOn;
    
    protected DomainEvent() {
        this.eventId = UUID.randomUUID().toString();
        this.occurredOn = LocalDateTime.now();
    }
    
    // Getters
}

public class UserCreatedEvent extends DomainEvent {
    private final String userId;
    private final String email;
    private final String firstName;
    private final String lastName;
    
    public UserCreatedEvent(String userId, String email, String firstName, String lastName) {
        super();
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getters
}

public class UserEmailChangedEvent extends DomainEvent {
    private final String userId;
    private final String oldEmail;
    private final String newEmail;
    
    // Constructor and getters
}
```

#### CQRS (Command Query Responsibility Segregation)
```java
// Command side
public interface Command {
}

public class CreateUserCommand implements Command {
    private final String email;
    private final String firstName;
    private final String lastName;
    
    // Constructor and getters
}

@Service
public class UserCommandHandler {
    private final UserEventStore eventStore;
    
    public void handle(CreateUserCommand command) {
        String userId = UUID.randomUUID().toString();
        
        UserCreatedEvent event = new UserCreatedEvent(
            userId,
            command.getEmail(),
            command.getFirstName(),
            command.getLastName()
        );
        
        eventStore.saveEvent(userId, event);
    }
}

// Query side
@Entity
@Table(name = "user_view")
public class UserView {
    @Id
    private String id;
    private String email;
    private String fullName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}

@Service
public class UserQueryHandler {
    private final UserViewRepository repository;
    
    @EventListener
    public void on(UserCreatedEvent event) {
        UserView view = new UserView();
        view.setId(event.getUserId());
        view.setEmail(event.getEmail());
        view.setFullName(event.getFirstName() + " " + event.getLastName());
        view.setCreatedAt(event.getOccurredOn());
        view.setUpdatedAt(event.getOccurredOn());
        
        repository.save(view);
    }
    
    @EventListener
    public void on(UserEmailChangedEvent event) {
        UserView view = repository.findById(event.getUserId())
            .orElseThrow(() -> new IllegalStateException("User view not found"));
        
        view.setEmail(event.getNewEmail());
        view.setUpdatedAt(event.getOccurredOn());
        
        repository.save(view);
    }
    
    public Optional<UserView> findById(String id) {
        return repository.findById(id);
    }
    
    public List<UserView> findByEmail(String email) {
        return repository.findByEmailContaining(email);
    }
}
```

## Layered Architecture

### Overview
Layered architecture organizes code into horizontal layers with each layer only communicating with the layer directly below it.

### Common Layers
1. **Presentation Layer**: UI, Controllers
2. **Business/Service Layer**: Business logic
3. **Persistence Layer**: Data access
4. **Database Layer**: Data storage

### Implementation
```java
// Presentation Layer
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto user = userService.createUser(request);
        return ResponseEntity.ok(user);
    }
}

// Business Layer
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return UserMapper.toDto(user);
    }
    
    public UserDto createUser(CreateUserRequest request) {
        // Business logic
        validateEmail(request.getEmail());
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        User savedUser = userRepository.save(user);
        
        // Business rule: Send welcome email
        emailService.sendWelcomeEmail(savedUser.getEmail());
        
        return UserMapper.toDto(savedUser);
    }
    
    private void validateEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
    }
}

// Persistence Layer
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}

// Domain Layer
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    // Constructors, getters, setters
}
```

## Hexagonal Architecture (Ports and Adapters)

### Overview
Hexagonal architecture isolates the core business logic from external concerns using ports and adapters.

### Components
- **Domain**: Core business logic
- **Ports**: Interfaces for communication
- **Adapters**: Implementations of ports

### Implementation
```java
// Domain - Core business logic
public class User {
    private final UserId id;
    private Email email;
    private final String firstName;
    private final String lastName;
    private final List<DomainEvent> domainEvents;
    
    public User(UserId id, Email email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.domainEvents = new ArrayList<>();
        
        // Domain event
        this.domainEvents.add(new UserCreatedEvent(id, email, firstName, lastName));
    }
    
    public void changeEmail(Email newEmail) {
        if (!this.email.equals(newEmail)) {
            Email oldEmail = this.email;
            this.email = newEmail;
            this.domainEvents.add(new UserEmailChangedEvent(id, oldEmail, newEmail));
        }
    }
    
    public List<DomainEvent> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }
    
    public void clearDomainEvents() {
        domainEvents.clear();
    }
}

// Ports - Interfaces
public interface UserRepository {
    Optional<User> findById(UserId id);
    void save(User user);
    boolean existsByEmail(Email email);
}

public interface EmailService {
    void sendWelcomeEmail(Email email);
}

// Use Cases - Application layer
@UseCase
public class CreateUserUseCase {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final DomainEventPublisher eventPublisher;
    
    @Transactional
    public UserId createUser(CreateUserCommand command) {
        Email email = new Email(command.getEmail());
        
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        
        UserId userId = UserId.generate();
        User user = new User(userId, email, command.getFirstName(), command.getLastName());
        
        userRepository.save(user);
        
        // Publish domain events
        user.getDomainEvents().forEach(eventPublisher::publish);
        user.clearDomainEvents();
        
        return userId;
    }
}

// Adapters - Infrastructure implementations
@Repository
public class JpaUserRepository implements UserRepository {
    private final JpaUserEntityRepository jpaRepository;
    
    @Override
    public Optional<User> findById(UserId id) {
        return jpaRepository.findById(id.getValue())
            .map(UserMapper::toDomain);
    }
    
    @Override
    public void save(User user) {
        UserEntity entity = UserMapper.toEntity(user);
        jpaRepository.save(entity);
    }
    
    @Override
    public boolean existsByEmail(Email email) {
        return jpaRepository.existsByEmail(email.getValue());
    }
}

@Service
public class SmtpEmailService implements EmailService {
    private final JavaMailSender mailSender;
    
    @Override
    public void sendWelcomeEmail(Email email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email.getValue());
        message.setSubject("Welcome!");
        message.setText("Welcome to our platform!");
        
        mailSender.send(message);
    }
}
```

## Choosing the Right Architecture

### Decision Matrix

| Architecture | Team Size | Complexity | Scalability | Technology Diversity | Operational Complexity |
|--------------|-----------|------------|-------------|---------------------|----------------------|
| Monolithic | Small | Low | Limited | Low | Low |
| Modular Monolith | Medium | Medium | Medium | Low | Low |
| Microservices | Large | High | High | High | High |
| Serverless | Variable | Medium | High | Medium | Medium |

### Guidelines

1. **Start Simple**: Begin with monolithic architecture
2. **Evolve Gradually**: Extract services when clear boundaries emerge
3. **Consider Team Structure**: Conway's Law applies
4. **Evaluate Operational Capability**: Can you manage distributed systems?
5. **Business Requirements**: Does your domain benefit from service boundaries?

Each architectural style has its place. Choose based on your specific context, team capabilities, and business requirements rather than following trends.