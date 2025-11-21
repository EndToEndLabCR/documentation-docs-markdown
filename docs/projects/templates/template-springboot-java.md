# Template Spring Boot Java

This file documents the Spring Boot Java template project structure and implementation details.

## Project Overview

The Template Spring Boot Java is a comprehensive starter template for building enterprise-grade Java applications using Spring Boot. It incorporates modern Java development practices and industry-standard patterns.

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Java Version**: Java 17+
- **Database**: PostgreSQL with Spring Data JPA
- **Security**: Spring Security with JWT
- **Testing**: JUnit 5, Mockito, TestContainers
- **Build Tool**: Maven or Gradle
- **Documentation**: SpringDoc OpenAPI 3

## Project Structure

```
template-springboot-java/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/endtoendlabcr/template/
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── DatabaseConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   └── UserController.java
│   │   │       ├── dto/
│   │   │       │   ├── UserDto.java
│   │   │       │   └── AuthDto.java
│   │   │       ├── entity/
│   │   │       │   ├── User.java
│   │   │       │   └── BaseEntity.java
│   │   │       ├── repository/
│   │   │       │   └── UserRepository.java
│   │   │       ├── service/
│   │   │       │   ├── UserService.java
│   │   │       │   └── AuthService.java
│   │   │       ├── security/
│   │   │       │   ├── JwtAuthenticationFilter.java
│   │   │       │   └── JwtTokenProvider.java
│   │   │       ├── exception/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   └── CustomExceptions.java
│   │   │       └── TemplateApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── db/migration/
│   └── test/
│       └── java/
│           └── com/endtoendlabcr/template/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Key Features

### Spring Security Integration
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### Entity Design
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name")
    private String fullName;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
```

### Service Layer
```java
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    public UserDto createUser(CreateUserDto createUserDto) {
        if (userRepository.existsByEmail(createUserDto.getEmail())) {
            throw new UserAlreadyExistsException("User with email already exists");
        }
        
        User user = User.builder()
            .email(createUserDto.getEmail())
            .password(passwordEncoder.encode(createUserDto.getPassword()))
            .fullName(createUserDto.getFullName())
            .role(UserRole.USER)
            .build();
        
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }
    
    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(userMapper::toDto);
    }
}
```

### REST Controller
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        UserDto user = userService.createUser(createUserDto);
        return ResponseEntity.created(URI.create("/api/users/" + user.getId())).body(user);
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
}
```

## Configuration

### Application Properties
```yaml
# application.yml
spring:
  application:
    name: template-springboot-java
  profiles:
    active: dev
  
  datasource:
    url: jdbc:postgresql://localhost:5432/template_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000 # 24 hours

logging:
  level:
    com.endtoendlabcr.template: DEBUG
    org.springframework.security: DEBUG
```

## Testing

### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void createUser_ShouldReturnUserDto_WhenValidInput() {
        // Given
        CreateUserDto createUserDto = new CreateUserDto("test@example.com", "password", "Test User");
        User savedUser = User.builder().id(1L).email("test@example.com").build();
        
        when(userRepository.existsByEmail(createUserDto.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(createUserDto.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When
        UserDto result = userService.createUser(createUserDto);
        
        // Then
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
    }
}
```

### Integration Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = "spring.profiles.active=test")
class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void createUser_ShouldReturn201_WhenValidInput() {
        // Given
        CreateUserDto createUserDto = new CreateUserDto("test@example.com", "password", "Test User");
        
        // When
        ResponseEntity<UserDto> response = restTemplate.postForEntity(
            "/api/users", createUserDto, UserDto.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getEmail()).isEqualTo("test@example.com");
    }
}
```

## Docker Configuration

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/template-springboot-java-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Best Practices Implemented

- Layered architecture (Controller → Service → Repository)
- DTO pattern for data transfer
- Global exception handling
- Input validation
- Pagination and sorting
- Database migrations with Flyway
- Comprehensive logging
- Security best practices
- Test-driven development
- Docker containerization