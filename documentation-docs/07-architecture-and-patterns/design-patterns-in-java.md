# Design Patterns in Java

This file explores common design patterns in Java with enterprise-grade examples and Spring Framework integration.

## Creational Patterns

### Singleton Pattern
Thread-safe singleton implementations in Java.

```java
// Enum-based singleton (recommended approach)
public enum DatabaseConnection {
    INSTANCE;
    
    private Connection connection;
    
    private DatabaseConnection() {
        // Initialize connection
        this.connection = DriverManager.getConnection(
            "jdbc:postgresql://localhost:5432/mydb", "user", "password");
    }
    
    public Connection getConnection() {
        return connection;
    }
    
    public void executeQuery(String sql) {
        try (Statement stmt = connection.createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            // Process results
        } catch (SQLException e) {
            throw new RuntimeException("Query execution failed", e);
        }
    }
}

// Usage
DatabaseConnection.INSTANCE.executeQuery("SELECT * FROM users");

// Thread-safe lazy initialization
public class Logger {
    private static volatile Logger instance;
    private final List<String> logs = new ArrayList<>();
    
    private Logger() {
        // Private constructor
    }
    
    public static Logger getInstance() {
        if (instance == null) {
            synchronized (Logger.class) {
                if (instance == null) {
                    instance = new Logger();
                }
            }
        }
        return instance;
    }
    
    public synchronized void log(String message) {
        logs.add(LocalDateTime.now() + ": " + message);
    }
}

// Spring Framework approach
@Component
@Scope("singleton") // Default scope
public class ApplicationLogger {
    private final List<String> logs = new CopyOnWriteArrayList<>();
    
    public void log(String message) {
        logs.add(LocalDateTime.now() + ": " + message);
    }
}
```

### Factory Pattern
Create objects without specifying exact classes.

```java
// Abstract factory interface
public interface PaymentProcessorFactory {
    PaymentProcessor createProcessor();
    PaymentValidator createValidator();
}

// Abstract products
public interface PaymentProcessor {
    PaymentResult process(PaymentRequest request);
}

public interface PaymentValidator {
    ValidationResult validate(PaymentRequest request);
}

// Concrete implementations
public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public PaymentResult process(PaymentRequest request) {
        // Credit card processing logic
        return new PaymentResult(true, "Payment processed successfully");
    }
}

public class CreditCardValidator implements PaymentValidator {
    @Override
    public ValidationResult validate(PaymentRequest request) {
        // Credit card validation logic
        return new ValidationResult(true, "Valid credit card");
    }
}

public class PayPalProcessor implements PaymentProcessor {
    @Override
    public PaymentResult process(PaymentRequest request) {
        // PayPal processing logic
        return new PaymentResult(true, "PayPal payment processed");
    }
}

public class PayPalValidator implements PaymentValidator {
    @Override
    public ValidationResult validate(PaymentRequest request) {
        // PayPal validation logic
        return new ValidationResult(true, "Valid PayPal account");
    }
}

// Concrete factories
public class CreditCardFactory implements PaymentProcessorFactory {
    @Override
    public PaymentProcessor createProcessor() {
        return new CreditCardProcessor();
    }
    
    @Override
    public PaymentValidator createValidator() {
        return new CreditCardValidator();
    }
}

public class PayPalFactory implements PaymentProcessorFactory {
    @Override
    public PaymentProcessor createProcessor() {
        return new PayPalProcessor();
    }
    
    @Override
    public PaymentValidator createValidator() {
        return new PayPalValidator();
    }
}

// Factory registry
public class PaymentFactoryRegistry {
    private static final Map<PaymentType, PaymentProcessorFactory> factories = new HashMap<>();
    
    static {
        factories.put(PaymentType.CREDIT_CARD, new CreditCardFactory());
        factories.put(PaymentType.PAYPAL, new PayPalFactory());
    }
    
    public static PaymentProcessorFactory getFactory(PaymentType type) {
        PaymentProcessorFactory factory = factories.get(type);
        if (factory == null) {
            throw new UnsupportedOperationException("Payment type not supported: " + type);
        }
        return factory;
    }
}

// Spring Framework approach with @Configuration
@Configuration
public class PaymentConfiguration {
    
    @Bean
    @Qualifier("creditCard")
    public PaymentProcessor creditCardProcessor() {
        return new CreditCardProcessor();
    }
    
    @Bean
    @Qualifier("paypal")
    public PaymentProcessor paypalProcessor() {
        return new PayPalProcessor();
    }
    
    @Bean
    public PaymentProcessorFactory paymentProcessorFactory(
            @Qualifier("creditCard") PaymentProcessor creditCardProcessor,
            @Qualifier("paypal") PaymentProcessor paypalProcessor) {
        
        return new PaymentProcessorFactory() {
            private final Map<PaymentType, PaymentProcessor> processors = Map.of(
                PaymentType.CREDIT_CARD, creditCardProcessor,
                PaymentType.PAYPAL, paypalProcessor
            );
            
            @Override
            public PaymentProcessor createProcessor(PaymentType type) {
                return processors.get(type);
            }
        };
    }
}
```

### Builder Pattern
Construct complex objects step by step.

```java
// Traditional Builder Pattern
public class User {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phone;
    private final LocalDate birthDate;
    private final List<String> roles;
    private final boolean isActive;
    
    private User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.phone = builder.phone;
        this.birthDate = builder.birthDate;
        this.roles = builder.roles;
        this.isActive = builder.isActive;
    }
    
    public static class Builder {
        // Required parameters
        private final String firstName;
        private final String lastName;
        private final String email;
        
        // Optional parameters with default values
        private String phone = "";
        private LocalDate birthDate = null;
        private List<String> roles = new ArrayList<>();
        private boolean isActive = true;
        
        public Builder(String firstName, String lastName, String email) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder birthDate(LocalDate birthDate) {
            this.birthDate = birthDate;
            return this;
        }
        
        public Builder addRole(String role) {
            this.roles.add(role);
            return this;
        }
        
        public Builder roles(List<String> roles) {
            this.roles = new ArrayList<>(roles);
            return this;
        }
        
        public Builder active(boolean isActive) {
            this.isActive = isActive;
            return this;
        }
        
        public User build() {
            validateRequiredFields();
            return new User(this);
        }
        
        private void validateRequiredFields() {
            if (firstName == null || firstName.trim().isEmpty()) {
                throw new IllegalArgumentException("First name is required");
            }
            if (lastName == null || lastName.trim().isEmpty()) {
                throw new IllegalArgumentException("Last name is required");
            }
            if (email == null || !isValidEmail(email)) {
                throw new IllegalArgumentException("Valid email is required");
            }
        }
        
        private boolean isValidEmail(String email) {
            return email.contains("@") && email.contains(".");
        }
    }
    
    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public LocalDate getBirthDate() { return birthDate; }
    public List<String> getRoles() { return new ArrayList<>(roles); }
    public boolean isActive() { return isActive; }
}

// Usage
User user = new User.Builder("John", "Doe", "john.doe@example.com")
    .phone("+1234567890")
    .birthDate(LocalDate.of(1990, 1, 1))
    .addRole("USER")
    .addRole("ADMIN")
    .active(true)
    .build();

// Modern Java with Records and Builder Pattern
public record UserRecord(
    String firstName,
    String lastName,
    String email,
    String phone,
    LocalDate birthDate,
    List<String> roles,
    boolean isActive
) {
    public static class Builder {
        private String firstName;
        private String lastName;
        private String email;
        private String phone = "";
        private LocalDate birthDate = null;
        private List<String> roles = new ArrayList<>();
        private boolean isActive = true;
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        // ... other builder methods
        
        public UserRecord build() {
            return new UserRecord(firstName, lastName, email, phone, 
                                birthDate, List.copyOf(roles), isActive);
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}
```

## Structural Patterns

### Adapter Pattern
Make incompatible interfaces work together.

```java
// Legacy third-party payment service
public class LegacyPaymentService {
    public String processPayment(String cardNumber, double amount) {
        // Legacy payment processing
        return "Legacy payment processed: $" + amount;
    }
}

// Modern payment interface
public interface ModernPaymentProcessor {
    PaymentResult processPayment(PaymentRequest request);
}

// Adapter class
public class LegacyPaymentAdapter implements ModernPaymentProcessor {
    private final LegacyPaymentService legacyService;
    
    public LegacyPaymentAdapter(LegacyPaymentService legacyService) {
        this.legacyService = legacyService;
    }
    
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        try {
            // Convert modern request to legacy format
            String legacyResult = legacyService.processPayment(
                request.getCardNumber(), 
                request.getAmount()
            );
            
            // Convert legacy response to modern format
            return new PaymentResult(
                true, 
                legacyResult, 
                generateTransactionId()
            );
        } catch (Exception e) {
            return new PaymentResult(
                false, 
                "Payment failed: " + e.getMessage(), 
                null
            );
        }
    }
    
    private String generateTransactionId() {
        return UUID.randomUUID().toString();
    }
}

// Spring Framework integration
@Service
public class PaymentService {
    private final ModernPaymentProcessor paymentProcessor;
    
    public PaymentService(@Qualifier("legacyAdapter") ModernPaymentProcessor paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }
    
    public PaymentResult processPayment(PaymentRequest request) {
        return paymentProcessor.processPayment(request);
    }
}

@Configuration
public class PaymentAdapterConfiguration {
    
    @Bean
    public LegacyPaymentService legacyPaymentService() {
        return new LegacyPaymentService();
    }
    
    @Bean
    @Qualifier("legacyAdapter")
    public ModernPaymentProcessor legacyPaymentAdapter(LegacyPaymentService legacyService) {
        return new LegacyPaymentAdapter(legacyService);
    }
}
```

### Decorator Pattern
Add behavior to objects dynamically.

```java
// Component interface
public interface Coffee {
    String getDescription();
    double getCost();
}

// Concrete component
public class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple coffee";
    }
    
    @Override
    public double getCost() {
        return 2.00;
    }
}

// Decorator base class
public abstract class CoffeeDecorator implements Coffee {
    protected final Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription();
    }
    
    @Override
    public double getCost() {
        return coffee.getCost();
    }
}

// Concrete decorators
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", milk";
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.50;
    }
}

public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", sugar";
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.25;
    }
}

public class VanillaDecorator extends CoffeeDecorator {
    public VanillaDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", vanilla";
    }
    
    @Override
    public double getCost() {
        return coffee.getCost() + 0.75;
    }
}

// Usage
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new VanillaDecorator(coffee);

System.out.println(coffee.getDescription()); // "Simple coffee, milk, sugar, vanilla"
System.out.println("Cost: $" + coffee.getCost()); // "Cost: $3.50"

// Spring AOP as Decorator Pattern
@Service
public class UserService {
    
    @Transactional
    @Cacheable("users")
    @LogExecutionTime
    public User getUserById(Long id) {
        // Service logic
        return userRepository.findById(id);
    }
}

// Custom annotation for decoration
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}

@Aspect
@Component
public class ExecutionTimeAspect {
    
    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long endTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        
        System.out.println(methodName + " executed in " + (endTime - startTime) + "ms");
        
        return result;
    }
}
```

## Behavioral Patterns

### Observer Pattern
Define one-to-many dependency between objects.

```java
// Observer interface
public interface EventListener<T> {
    void onEvent(T event);
}

// Subject (Observable)
public class EventPublisher<T> {
    private final List<EventListener<T>> listeners = new CopyOnWriteArrayList<>();
    
    public void addListener(EventListener<T> listener) {
        listeners.add(listener);
    }
    
    public void removeListener(EventListener<T> listener) {
        listeners.remove(listener);
    }
    
    public void notifyListeners(T event) {
        for (EventListener<T> listener : listeners) {
            try {
                listener.onEvent(event);
            } catch (Exception e) {
                // Log error but don't stop other listeners
                System.err.println("Error in listener: " + e.getMessage());
            }
        }
    }
}

// Event classes
public class UserCreatedEvent {
    private final User user;
    private final LocalDateTime timestamp;
    
    public UserCreatedEvent(User user) {
        this.user = user;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters
    public User getUser() { return user; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// Concrete observers
public class EmailNotificationListener implements EventListener<UserCreatedEvent> {
    @Override
    public void onEvent(UserCreatedEvent event) {
        sendWelcomeEmail(event.getUser());
    }
    
    private void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to: " + user.getEmail());
    }
}

public class AuditLogListener implements EventListener<UserCreatedEvent> {
    @Override
    public void onEvent(UserCreatedEvent event) {
        logUserCreation(event.getUser(), event.getTimestamp());
    }
    
    private void logUserCreation(User user, LocalDateTime timestamp) {
        System.out.println("User created: " + user.getEmail() + " at " + timestamp);
    }
}

// Usage
EventPublisher<UserCreatedEvent> publisher = new EventPublisher<>();
publisher.addListener(new EmailNotificationListener());
publisher.addListener(new AuditLogListener());

User newUser = new User.Builder("John", "Doe", "john@example.com").build();
publisher.notifyListeners(new UserCreatedEvent(newUser));

// Spring Framework approach with ApplicationEvents
@Component
public class UserService {
    private final ApplicationEventPublisher eventPublisher;
    
    public UserService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    public User createUser(CreateUserRequest request) {
        User user = new User.Builder(request.getFirstName(), request.getLastName(), request.getEmail()).build();
        // Save user to database
        
        eventPublisher.publishEvent(new UserCreatedEvent(user));
        return user;
    }
}

@EventListener
@Component
public class UserEventHandler {
    
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        // Send welcome email
        sendWelcomeEmail(event.getUser());
    }
    
    @EventListener
    @Async
    public void handleUserCreatedAsync(UserCreatedEvent event) {
        // Async processing like generating reports
        generateUserReport(event.getUser());
    }
    
    private void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to: " + user.getEmail());
    }
    
    private void generateUserReport(User user) {
        System.out.println("Generating report for user: " + user.getEmail());
    }
}
```

### Strategy Pattern
Define a family of algorithms and make them interchangeable.

```java
// Strategy interface
public interface SortingStrategy<T> {
    void sort(List<T> list, Comparator<T> comparator);
}

// Concrete strategies
public class BubbleSortStrategy<T> implements SortingStrategy<T> {
    @Override
    public void sort(List<T> list, Comparator<T> comparator) {
        for (int i = 0; i < list.size() - 1; i++) {
            for (int j = 0; j < list.size() - i - 1; j++) {
                if (comparator.compare(list.get(j), list.get(j + 1)) > 0) {
                    Collections.swap(list, j, j + 1);
                }
            }
        }
    }
}

public class QuickSortStrategy<T> implements SortingStrategy<T> {
    @Override
    public void sort(List<T> list, Comparator<T> comparator) {
        if (list.size() <= 1) return;
        quickSort(list, 0, list.size() - 1, comparator);
    }
    
    private void quickSort(List<T> list, int low, int high, Comparator<T> comparator) {
        if (low < high) {
            int partitionIndex = partition(list, low, high, comparator);
            quickSort(list, low, partitionIndex - 1, comparator);
            quickSort(list, partitionIndex + 1, high, comparator);
        }
    }
    
    private int partition(List<T> list, int low, int high, Comparator<T> comparator) {
        T pivot = list.get(high);
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (comparator.compare(list.get(j), pivot) <= 0) {
                i++;
                Collections.swap(list, i, j);
            }
        }
        Collections.swap(list, i + 1, high);
        return i + 1;
    }
}

// Context class
public class Sorter<T> {
    private SortingStrategy<T> strategy;
    
    public void setStrategy(SortingStrategy<T> strategy) {
        this.strategy = strategy;
    }
    
    public void sort(List<T> list, Comparator<T> comparator) {
        if (strategy == null) {
            throw new IllegalStateException("Sorting strategy not set");
        }
        strategy.sort(list, comparator);
    }
}

// Usage
List<Integer> numbers = new ArrayList<>(Arrays.asList(64, 34, 25, 12, 22, 11, 90));
Sorter<Integer> sorter = new Sorter<>();

// Use bubble sort for small lists
if (numbers.size() < 10) {
    sorter.setStrategy(new BubbleSortStrategy<>());
} else {
    sorter.setStrategy(new QuickSortStrategy<>());
}

sorter.sort(numbers, Integer::compareTo);

// Spring Framework approach
@Service
public class ReportService {
    private final Map<ReportType, ReportGenerator> generators;
    
    public ReportService(List<ReportGenerator> generatorList) {
        this.generators = generatorList.stream()
            .collect(Collectors.toMap(
                ReportGenerator::getType,
                Function.identity()
            ));
    }
    
    public Report generateReport(ReportType type, ReportData data) {
        ReportGenerator generator = generators.get(type);
        if (generator == null) {
            throw new UnsupportedOperationException("Report type not supported: " + type);
        }
        return generator.generate(data);
    }
}

public interface ReportGenerator {
    ReportType getType();
    Report generate(ReportData data);
}

@Component
public class PDFReportGenerator implements ReportGenerator {
    @Override
    public ReportType getType() {
        return ReportType.PDF;
    }
    
    @Override
    public Report generate(ReportData data) {
        // PDF generation logic
        return new Report(ReportType.PDF, generatePDFContent(data));
    }
}

@Component
public class ExcelReportGenerator implements ReportGenerator {
    @Override
    public ReportType getType() {
        return ReportType.EXCEL;
    }
    
    @Override
    public Report generate(ReportData data) {
        // Excel generation logic
        return new Report(ReportType.EXCEL, generateExcelContent(data));
    }
}
```

### Command Pattern
Encapsulate requests as objects.

```java
// Command interface
public interface Command {
    void execute();
    void undo();
}

// Receiver classes
public class Light {
    private boolean isOn = false;
    private final String location;
    
    public Light(String location) {
        this.location = location;
    }
    
    public void turnOn() {
        isOn = true;
        System.out.println(location + " light is ON");
    }
    
    public void turnOff() {
        isOn = false;
        System.out.println(location + " light is OFF");
    }
    
    public boolean isOn() {
        return isOn;
    }
}

// Concrete commands
public class LightOnCommand implements Command {
    private final Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOn();
    }
    
    @Override
    public void undo() {
        light.turnOff();
    }
}

public class LightOffCommand implements Command {
    private final Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOff();
    }
    
    @Override
    public void undo() {
        light.turnOn();
    }
}

// Macro command
public class MacroCommand implements Command {
    private final List<Command> commands;
    
    public MacroCommand(List<Command> commands) {
        this.commands = new ArrayList<>(commands);
    }
    
    @Override
    public void execute() {
        commands.forEach(Command::execute);
    }
    
    @Override
    public void undo() {
        // Undo in reverse order
        for (int i = commands.size() - 1; i >= 0; i--) {
            commands.get(i).undo();
        }
    }
}

// Invoker
public class RemoteControl {
    private final Map<Integer, Command> commands = new HashMap<>();
    private final Stack<Command> commandHistory = new Stack<>();
    
    public void setCommand(int slot, Command command) {
        commands.put(slot, command);
    }
    
    public void pressButton(int slot) {
        Command command = commands.get(slot);
        if (command != null) {
            command.execute();
            commandHistory.push(command);
        }
    }
    
    public void pressUndo() {
        if (!commandHistory.isEmpty()) {
            Command lastCommand = commandHistory.pop();
            lastCommand.undo();
        }
    }
}

// Usage
Light livingRoomLight = new Light("Living Room");
Light kitchenLight = new Light("Kitchen");

Command livingRoomOn = new LightOnCommand(livingRoomLight);
Command livingRoomOff = new LightOffCommand(livingRoomLight);
Command kitchenOn = new LightOnCommand(kitchenLight);
Command kitchenOff = new LightOffCommand(kitchenLight);

// Macro for "Party Mode"
List<Command> partyCommands = Arrays.asList(livingRoomOn, kitchenOn);
Command partyMode = new MacroCommand(partyCommands);

RemoteControl remote = new RemoteControl();
remote.setCommand(1, livingRoomOn);
remote.setCommand(2, livingRoomOff);
remote.setCommand(3, partyMode);

remote.pressButton(1); // Turn on living room light
remote.pressUndo();    // Turn off living room light
remote.pressButton(3); // Party mode - turn on all lights

// Spring Framework approach with @Async
@Service
public class CommandExecutorService {
    
    @Async
    public CompletableFuture<Void> executeAsync(Command command) {
        command.execute();
        return CompletableFuture.completedFuture(null);
    }
    
    public void executeWithRetry(Command command, int maxRetries) {
        int attempts = 0;
        while (attempts < maxRetries) {
            try {
                command.execute();
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts >= maxRetries) {
                    throw new RuntimeException("Command failed after " + maxRetries + " attempts", e);
                }
            }
        }
    }
}
```

## Enterprise Patterns with Spring

### Repository Pattern with Spring Data

```java
// Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}

// Repository interface
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    int updateEmailById(@Param("id") Long id, @Param("email") String email);
}

// Service layer
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        
        return userRepository.save(user);
    }
}
```

### MVC Pattern with Spring

```java
// Controller
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserDto> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto user = userService.createUser(request);
        URI location = URI.create("/api/users/" + user.getId());
        return ResponseEntity.created(location).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserDto user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

// DTOs with validation
public class CreateUserRequest {
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    // Constructors, getters, setters
}
```

## Best Practices

### When to Use Each Pattern

1. **Singleton**: Configuration objects, logging, connection pools
2. **Factory**: Object creation based on runtime conditions
3. **Builder**: Complex objects with many optional parameters
4. **Observer**: Event-driven architectures, UI updates
5. **Strategy**: Multiple algorithms for the same task
6. **Command**: Undo/redo, macro operations, queuing

### Testing with Patterns

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void createUser_ShouldReturnUser_WhenValidRequest() {
        // Arrange
        CreateUserRequest request = new CreateUserRequest("John", "Doe", "john@example.com");
        User savedUser = new User(1L, "John", "Doe", "john@example.com");
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // Act
        UserDto result = userService.createUser(request);
        
        // Assert
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        verify(userRepository).save(any(User.class));
    }
}

// Testing with TestContainers for integration tests
@SpringBootTest
@Testcontainers
class UserRepositoryIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        // Arrange
        User user = new User("John", "Doe", "john@example.com");
        userRepository.save(user);
        
        // Act
        Optional<User> result = userRepository.findByEmail("john@example.com");
        
        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john@example.com");
    }
}
```

Design patterns in Java, especially when combined with Spring Framework, provide robust solutions for enterprise applications. Choose patterns based on specific requirements and avoid over-engineering simple solutions.