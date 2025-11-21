# Microservices Architecture

This file provides a comprehensive guide to implementing microservices architecture effectively.

## Core Principles

### Service Design Principles

- **Single Responsibility**: Each service has one business capability
- **Autonomous**: Services can be developed, deployed, and scaled independently
- **Business-Focused**: Services align with business domains
- **Decentralized**: No central coordination point
- **Failure-Resilient**: Services handle failures gracefully

### Domain-Driven Design Integration

```java
// Bounded Context example
@Service
public class OrderService {
    // Order domain logic only
    public Order createOrder(CreateOrderCommand command) {
        Order order = new Order(command.getUserId(), command.getItems());
        order.calculateTotal();
        return orderRepository.save(order);
    }
}

@Service
public class InventoryService {
    // Inventory domain logic only
    public void reserveItems(List<OrderItem> items) {
        for (OrderItem item : items) {
            inventory.reserve(item.getProductId(), item.getQuantity());
        }
    }
}
```

## Service Communication

### Synchronous Communication

```java
// Using Feign Client
@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
}

// With Circuit Breaker
@Service
public class OrderService {
    @Autowired
    private UserServiceClient userServiceClient;

    @CircuitBreaker(name = "user-service", fallbackMethod = "fallbackGetUser")
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }

    public User fallbackGetUser(Long userId, Exception ex) {
        return User.defaultUser(); // Fallback response
    }
}
```

### Asynchronous Communication

```java
// Event Publishing
@Component
public class OrderEventPublisher {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getUserId(),
            order.getTotal()
        );
        rabbitTemplate.convertAndSend("order.exchange", "order.created", event);
    }
}

// Event Consumption
@RabbitListener(queues = "notification.order.created")
public class NotificationService {
    public void handleOrderCreated(OrderCreatedEvent event) {
        sendOrderConfirmation(event.getUserId(), event.getOrderId());
    }
}
```

## Data Management

### Database per Service

```yaml
# Docker Compose for multiple databases
version: "3.8"
services:
  user-db:
    image: postgres:14
    environment:
      POSTGRES_DB: userdb
      POSTGRES_USER: user_svc
      POSTGRES_PASSWORD: password

  order-db:
    image: postgres:14
    environment:
      POSTGRES_DB: orderdb
      POSTGRES_USER: order_svc
      POSTGRES_PASSWORD: password

  product-db:
    image: mongo:5
    environment:
      MONGO_INITDB_DATABASE: productdb
```

### Saga Pattern for Distributed Transactions

```java
// Orchestration-based Saga
@Service
public class OrderSagaOrchestrator {

    public void processOrder(OrderRequest request) {
        try {
            // Step 1: Reserve inventory
            inventoryService.reserveItems(request.getItems());

            // Step 2: Process payment
            paymentService.processPayment(request.getPayment());

            // Step 3: Create order
            orderService.createOrder(request);

            // Step 4: Send confirmation
            notificationService.sendConfirmation(request.getUserId());

        } catch (Exception e) {
            // Compensate in reverse order
            compensate(request);
        }
    }

    private void compensate(OrderRequest request) {
        try {
            notificationService.sendCancellation(request.getUserId());
            orderService.cancelOrder(request.getOrderId());
            paymentService.refundPayment(request.getPayment());
            inventoryService.releaseItems(request.getItems());
        } catch (Exception e) {
            // Log compensation failure
            log.error("Saga compensation failed", e);
        }
    }
}

// Choreography-based Saga
@EventListener
public class InventoryService {

    @EventListener
    public void on(OrderCreatedEvent event) {
        try {
            reserveItems(event.getItems());
            eventPublisher.publish(new ItemsReservedEvent(event.getOrderId()));
        } catch (InsufficientInventoryException e) {
            eventPublisher.publish(new ItemReservationFailedEvent(event.getOrderId()));
        }
    }
}

@EventListener
public class PaymentService {

    @EventListener
    public void on(ItemsReservedEvent event) {
        try {
            processPayment(event.getOrderId());
            eventPublisher.publish(new PaymentProcessedEvent(event.getOrderId()));
        } catch (PaymentException e) {
            eventPublisher.publish(new PaymentFailedEvent(event.getOrderId()));
        }
    }
}
```

## Service Discovery

### Eureka Server Configuration

```java
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceRegistryApplication.class, args);
    }
}
```

### Service Registration

```yaml
# application.yml for service
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    hostname: localhost

spring:
  application:
    name: user-service
```

## API Gateway

### Spring Cloud Gateway

```java
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r.path("/api/users/**")
                .filters(f -> f.stripPrefix(1)
                    .circuitBreaker(c -> c.setName("user-service")
                        .setFallbackUri("forward:/fallback/users")))
                .uri("lb://user-service"))
            .route("order-service", r -> r.path("/api/orders/**")
                .filters(f -> f.stripPrefix(1)
                    .requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter())))
                .uri("lb://order-service"))
            .build();
    }
}
```

## Monitoring and Observability

### Distributed Tracing

```java
// Spring Cloud Sleuth configuration
@Configuration
public class TracingConfig {

    @Bean
    public Sender sender() {
        return OkHttpSender.create("http://zipkin:9411/api/v2/spans");
    }

    @Bean
    public AsyncReporter<Span> spanReporter() {
        return AsyncReporter.create(sender());
    }
}

// Custom tracing
@Service
public class UserService {

    @NewSpan("get-user")
    public User getUser(@SpanTag("userId") Long userId) {
        return userRepository.findById(userId);
    }
}
```

### Health Checks

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Available")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "Unavailable")
                .withException(e)
                .build();
        }
        return Health.down().build();
    }
}
```

## Deployment Strategies

### Kubernetes Deployment

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-service
          image: user-service:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
```

## Security

### JWT Authentication

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            .build();
    }
}
```

### Service-to-Service Authentication

```java
@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            String token = SecurityContextHolder.getContext()
                .getAuthentication()
                .getCredentials()
                .toString();
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }
}
```

## Best Practices

### Service Sizing

- **Team Size**: Two-pizza team rule (6-8 people)
- **Codebase**: Should be maintainable by one team
- **Data**: Single business entity or aggregate
- **Deployment**: Independently deployable

### Communication Guidelines

- **Prefer Async**: Use events for non-critical operations
- **Timeout Handling**: Always set timeouts for sync calls
- **Circuit Breakers**: Prevent cascade failures
- **Idempotency**: Make operations repeatable safely

### Testing Strategy

```java
// Contract Testing with Pact
@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "user-service")
public class UserServiceContractTest {

    @Pact(consumer = "order-service")
    public RequestResponsePact userExistsPact(PactDslWithProvider builder) {
        return builder
            .given("user exists")
            .uponReceiving("a request for user")
            .path("/users/123")
            .method("GET")
            .willRespondWith()
            .status(200)
            .body(LambdaDsl.newJsonBody(o -> o
                .numberType("id", 123)
                .stringType("email", "user@example.com")))
            .toPact();
    }

    @Test
    @PactTestFor(pactMethod = "userExistsPact")
    void testGetUser(MockServer mockServer) {
        UserServiceClient client = new UserServiceClient(mockServer.getUrl());
        User user = client.getUser(123L);

        assertThat(user.getId()).isEqualTo(123L);
        assertThat(user.getEmail()).isEqualTo("user@example.com");
    }
}
```

## Common Pitfalls

### Distributed Monolith

- Services are too tightly coupled
- Synchronous communication everywhere
- Shared databases between services
- Deploy services together

### Chatty Interfaces

- Too many service calls for single operation
- Fine-grained APIs
- Network overhead

### Data Consistency Issues

- Not handling eventual consistency
- Missing compensation logic
- Ignoring distributed transaction complexity

### Solutions

1. **Design for failure**: Assume services will fail
2. **Embrace eventual consistency**: Design business processes accordingly
3. **Monitor everything**: Comprehensive observability
4. **Start with monolith**: Extract services gradually
5. **Team boundaries**: Align services with team ownership
