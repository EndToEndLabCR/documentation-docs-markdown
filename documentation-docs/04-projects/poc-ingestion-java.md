# POC Ingestion Java

This file documents the Proof of Concept (POC) data ingestion project built with Java and Spring Boot.

## Project Overview

The POC Ingestion Java project demonstrates large-scale data ingestion capabilities using modern Java technologies. It's designed to handle high-volume data processing with fault tolerance, monitoring, and scalability in mind.

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Java Version**: Java 17+
- **Message Broker**: Apache Kafka
- **Database**: PostgreSQL + MongoDB
- **Caching**: Redis
- **Monitoring**: Micrometer + Prometheus
- **Processing**: Spring Batch
- **Testing**: TestContainers, JUnit 5

## Architecture Overview

```
Data Sources → Kafka → Ingestion Service → Processing → Storage
                ↓
           Dead Letter Queue
                ↓
           Error Handling Service
```

## Project Structure

```
poc-ingestion-java/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/endtoendlabcr/ingestion/
│   │   │       ├── config/
│   │   │       │   ├── KafkaConfig.java
│   │   │       │   ├── DatabaseConfig.java
│   │   │       │   └── BatchConfig.java
│   │   │       ├── consumer/
│   │   │       │   ├── DataIngestionConsumer.java
│   │   │       │   └── ErrorConsumer.java
│   │   │       ├── processor/
│   │   │       │   ├── DataProcessor.java
│   │   │       │   ├── ValidationProcessor.java
│   │   │       │   └── TransformationProcessor.java
│   │   │       ├── model/
│   │   │       │   ├── RawData.java
│   │   │       │   ├── ProcessedData.java
│   │   │       │   └── ErrorData.java
│   │   │       ├── repository/
│   │   │       │   ├── DataRepository.java
│   │   │       │   └── ErrorRepository.java
│   │   │       ├── service/
│   │   │       │   ├── IngestionService.java
│   │   │       │   ├── ProcessingService.java
│   │   │       │   └── MonitoringService.java
│   │   │       └── IngestionApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   └── test/
├── docker/
│   ├── kafka/
│   ├── postgres/
│   └── monitoring/
├── pom.xml
└── docker-compose.yml
```

## Key Components

### Kafka Configuration
```java
@Configuration
@EnableKafka
@Slf4j
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "ingestion-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 100);
        
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3); // Number of consumer threads
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        factory.setErrorHandler(new SeekToCurrentErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate()), 
            new FixedBackOff(1000L, 3)
        ));
        
        return factory;
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        props.put(ProducerConfig.LINGER_MS_CONFIG, 5);
        
        return new DefaultKafkaProducerFactory<>(props);
    }
}
```

### Data Ingestion Consumer
```java
@Component
@Slf4j
@RequiredArgsConstructor
public class DataIngestionConsumer {

    private final IngestionService ingestionService;
    private final MeterRegistry meterRegistry;
    private final Counter processedMessagesCounter;
    private final Counter errorCounter;

    @KafkaListener(topics = "${kafka.topic.raw-data}", groupId = "ingestion-group")
    public void consume(
            @Payload String message,
            @Header Map<String, Object> headers,
            Acknowledgment acknowledgment,
            ConsumerRecord<String, String> consumerRecord) {
        
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            log.info("Received message: key={}, partition={}, offset={}", 
                    consumerRecord.key(), 
                    consumerRecord.partition(), 
                    consumerRecord.offset());

            // Process the message
            RawData rawData = parseMessage(message, headers);
            ingestionService.processData(rawData);
            
            // Acknowledge successful processing
            acknowledgment.acknowledge();
            processedMessagesCounter.increment();
            
            log.debug("Successfully processed message with key: {}", consumerRecord.key());
            
        } catch (ValidationException e) {
            log.warn("Validation failed for message: {}", e.getMessage());
            handleValidationError(message, headers, e);
            acknowledgment.acknowledge(); // Acknowledge to avoid reprocessing
            errorCounter.increment("validation");
            
        } catch (ProcessingException e) {
            log.error("Processing failed for message: {}", e.getMessage(), e);
            handleProcessingError(message, headers, e);
            acknowledgment.acknowledge();
            errorCounter.increment("processing");
            
        } catch (Exception e) {
            log.error("Unexpected error processing message: {}", e.getMessage(), e);
            errorCounter.increment("unexpected");
            throw e; // Let Kafka retry mechanism handle it
            
        } finally {
            sample.stop(Timer.builder("kafka.message.processing.time")
                .description("Time taken to process Kafka message")
                .register(meterRegistry));
        }
    }

    private RawData parseMessage(String message, Map<String, Object> headers) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            RawData rawData = mapper.readValue(message, RawData.class);
            
            // Add metadata from headers
            rawData.setTimestamp(Instant.now());
            rawData.setSource(headers.get("source").toString());
            
            return rawData;
        } catch (JsonProcessingException e) {
            throw new ValidationException("Invalid JSON format: " + e.getMessage());
        }
    }
}
```

### Data Processing Service
```java
@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class IngestionService {

    private final DataRepository dataRepository;
    private final ValidationProcessor validationProcessor;
    private final TransformationProcessor transformationProcessor;
    private final RedisTemplate<String, Object> redisTemplate;

    public void processData(RawData rawData) {
        // Step 1: Validate incoming data
        ValidationResult validationResult = validationProcessor.validate(rawData);
        if (!validationResult.isValid()) {
            throw new ValidationException("Data validation failed: " + 
                String.join(", ", validationResult.getErrors()));
        }

        // Step 2: Check for duplicates using Redis cache
        String deduplicationKey = generateDeduplicationKey(rawData);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(deduplicationKey))) {
            log.warn("Duplicate data detected, skipping: {}", deduplicationKey);
            return;
        }

        // Step 3: Transform data
        ProcessedData processedData = transformationProcessor.transform(rawData);

        // Step 4: Enrich with additional data
        enrichData(processedData);

        // Step 5: Store in database
        dataRepository.save(processedData);

        // Step 6: Cache for deduplication
        redisTemplate.opsForValue().set(
            deduplicationKey, 
            true, 
            Duration.ofHours(24)
        );

        log.info("Successfully processed and stored data with ID: {}", processedData.getId());
    }

    private String generateDeduplicationKey(RawData rawData) {
        return "dedup:" + DigestUtils.md5Hex(
            rawData.getSource() + ":" + 
            rawData.getExternalId() + ":" + 
            rawData.getTimestamp().toString()
        );
    }

    private void enrichData(ProcessedData processedData) {
        // Add business logic for data enrichment
        if (processedData.getLocation() != null) {
            // Geocoding or location-based enrichment
            LocationData locationData = locationService.enrichLocation(processedData.getLocation());
            processedData.setEnrichedLocation(locationData);
        }

        // Add calculated fields
        processedData.setProcessingTimestamp(Instant.now());
        processedData.setDataQualityScore(calculateQualityScore(processedData));
    }
}
```

### Batch Processing Configuration
```java
@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
public class BatchConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final DataSource dataSource;

    @Bean
    public Job dataReprocessingJob() {
        return jobBuilderFactory.get("dataReprocessingJob")
            .incrementer(new RunIdIncrementer())
            .flow(reprocessingStep())
            .end()
            .build();
    }

    @Bean
    public Step reprocessingStep() {
        return stepBuilderFactory.get("reprocessingStep")
            .<ErrorData, ProcessedData>chunk(100)
            .reader(errorDataReader())
            .processor(reprocessingProcessor())
            .writer(processedDataWriter())
            .faultTolerant()
            .skipLimit(10)
            .skip(ProcessingException.class)
            .build();
    }

    @Bean
    @StepScope
    public JdbcCursorItemReader<ErrorData> errorDataReader() {
        return new JdbcCursorItemReaderBuilder<ErrorData>()
            .name("errorDataReader")
            .dataSource(dataSource)
            .sql("SELECT * FROM error_data WHERE status = 'PENDING' ORDER BY created_at")
            .rowMapper(new BeanPropertyRowMapper<>(ErrorData.class))
            .build();
    }

    @Bean
    public ItemProcessor<ErrorData, ProcessedData> reprocessingProcessor() {
        return errorData -> {
            try {
                // Attempt to reprocess the error data
                RawData rawData = reconstructRawData(errorData);
                return transformationProcessor.transform(rawData);
            } catch (Exception e) {
                log.error("Failed to reprocess error data: {}", errorData.getId(), e);
                return null; // Skip this item
            }
        };
    }
}
```

## Monitoring and Metrics

### Custom Metrics
```java
@Component
@RequiredArgsConstructor
public class IngestionMetrics {

    private final MeterRegistry meterRegistry;

    @PostConstruct
    public void initMetrics() {
        // Register custom gauges
        Gauge.builder("ingestion.queue.size")
            .description("Current size of the ingestion queue")
            .register(meterRegistry, this, IngestionMetrics::getQueueSize);

        Gauge.builder("ingestion.processing.rate")
            .description("Current processing rate per second")
            .register(meterRegistry, this, IngestionMetrics::getProcessingRate);
    }

    public double getQueueSize() {
        // Implementation to get queue size
        return queueService.getCurrentSize();
    }

    public double getProcessingRate() {
        // Implementation to calculate processing rate
        return metricsService.getProcessingRate();
    }

    @EventListener
    public void handleDataProcessed(DataProcessedEvent event) {
        Counter.builder("data.processed.total")
            .tag("source", event.getSource())
            .tag("type", event.getDataType())
            .description("Total number of processed data records")
            .register(meterRegistry)
            .increment();
    }
}
```

## Testing

### Integration Tests with TestContainers
```java
@SpringBootTest
@Testcontainers
class IngestionIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", redis::getFirstMappedPort);
    }

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private DataRepository dataRepository;

    @Test
    void shouldProcessKafkaMessage() throws Exception {
        // Given
        String testMessage = """
            {
                "externalId": "test-123",
                "data": "test data",
                "source": "test-source"
            }
            """;

        // When
        kafkaTemplate.send("raw-data", "test-key", testMessage).get();

        // Then
        await().atMost(10, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                List<ProcessedData> processedData = dataRepository.findAll();
                assertThat(processedData).hasSize(1);
                assertThat(processedData.get(0).getSource()).isEqualTo("test-source");
            });
    }
}
```

## Performance Characteristics

### Throughput Metrics
- **Target**: 10,000 messages/second
- **Latency**: < 100ms p95
- **Error Rate**: < 0.1%
- **Availability**: 99.9%

### Scalability Features
- Horizontal scaling with Kafka partitions
- Database connection pooling
- Redis caching for deduplication
- Batch processing for reprocessing
- Circuit breaker for external services

## Deployment

### Docker Compose
```yaml
version: '3.8'

services:
  ingestion-service:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ingestion
      - SPRING_REDIS_HOST=redis
    depends_on:
      - kafka
      - postgres
      - redis

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: ingestion
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
```

## Learning Outcomes

This POC demonstrates:
- Large-scale data ingestion patterns
- Kafka integration and error handling
- Spring Boot and Spring Batch usage
- Database optimization for high throughput
- Monitoring and observability
- Testing strategies for distributed systems
- Performance tuning and scalability considerations