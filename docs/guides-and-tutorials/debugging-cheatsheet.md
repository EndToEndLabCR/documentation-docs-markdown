# Debugging Cheatsheet

This file provides a comprehensive cheatsheet for debugging common issues across different technologies and environments.

## General Debugging Principles

### The Debugging Process

1. **Reproduce** the issue consistently
2. **Isolate** the problem area
3. **Examine** logs and error messages
4. **Hypothesize** potential causes
5. **Test** solutions incrementally
6. **Document** the solution

### Essential Debugging Tools

- **Logging**: Add strategic log statements
- **Debuggers**: Use IDE debuggers for step-through debugging
- **Network Tools**: Monitor network requests/responses
- **Performance Profilers**: Identify bottlenecks
- **Memory Analyzers**: Detect memory leaks

## Web Application Debugging

### Browser Developer Tools

#### Console Debugging

```javascript
// Basic logging
console.log("Variable value:", variable);
console.error("Error occurred:", error);
console.warn("Warning message");

// Object inspection
console.table(arrayOfObjects);
console.dir(complexObject);

// Performance timing
console.time("operation");
// ... code to measure
console.timeEnd("operation");

// Stack trace
console.trace("Execution path");

// Group related logs
console.group("API Calls");
console.log("Request 1");
console.log("Request 2");
console.groupEnd();
```

#### Network Tab Analysis

- Check request/response headers
- Verify HTTP status codes
- Inspect request payloads
- Monitor response times
- Look for CORS issues

#### Elements Tab Tips

```javascript
// Select element in console
$0; // Currently selected element
$1; // Previously selected element

// Find elements
$("selector"); // querySelector
$$("selector"); // querySelectorAll

// Monitor events
monitorEvents($0, "click");
unmonitorEvents($0);
```

### React Debugging

#### React Developer Tools

```javascript
// Component debugging
console.log("Props:", props);
console.log("State:", state);

// Performance profiling
import { Profiler } from "react";

function onRenderCallback(id, phase, actualDuration) {
  console.log("Component rendered:", { id, phase, actualDuration });
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>;
```

#### Common React Issues

```javascript
// State not updating immediately
const [count, setCount] = useState(0);

// Wrong - state is stale
const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still old value
};

// Correct - use functional update
const handleClick = () => {
  setCount((prev) => {
    console.log("New value:", prev + 1);
    return prev + 1;
  });
};

// Effect dependency issues
useEffect(() => {
  fetchData(userId);
}, [userId]); // Include all dependencies

// Infinite re-renders
useEffect(() => {
  setData(processData()); // Don't call setState without dependencies
}, []); // Empty dependency array needed
```

## API Debugging

### HTTP Status Codes

| Code | Meaning               | Debug Actions                      |
| ---- | --------------------- | ---------------------------------- |
| 400  | Bad Request           | Check request payload format       |
| 401  | Unauthorized          | Verify authentication tokens       |
| 403  | Forbidden             | Check user permissions             |
| 404  | Not Found             | Verify URL and route configuration |
| 429  | Too Many Requests     | Implement rate limiting or backoff |
| 500  | Internal Server Error | Check server logs                  |
| 502  | Bad Gateway           | Check proxy/load balancer config   |
| 503  | Service Unavailable   | Check service health               |

### curl Debugging Commands

```bash
# Basic GET request
curl -v https://api.example.com/users

# POST with JSON data
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{"name":"John","email":"john@example.com"}' \
  https://api.example.com/users

# Save response to file
curl -o response.json https://api.example.com/data

# Follow redirects
curl -L https://api.example.com/redirect

# Show only response headers
curl -I https://api.example.com/users

# Test with different HTTP methods
curl -X PUT -d "data" https://api.example.com/resource/1
curl -X DELETE https://api.example.com/resource/1
```

### Python Requests Debugging

```python
import requests
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Add request/response logging
session = requests.Session()
session.hooks['response'] = lambda r, *args, **kwargs: print(f"Response: {r.status_code}")

# Debug specific request
response = requests.get('https://api.example.com/users',
                       headers={'Authorization': 'Bearer token'})

print(f"Status: {response.status_code}")
print(f"Headers: {response.headers}")
print(f"Content: {response.text}")
```

## Database Debugging

### PostgreSQL Debugging

```sql
-- Check active connections
SELECT pid, usename, application_name, client_addr, state, query
FROM pg_stat_activity
WHERE state = 'active';

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- Check table sizes
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor locks
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### MongoDB Debugging

```javascript
// Enable profiler
db.setProfilingLevel(2);

// Check slow operations
db.system.profile.find().limit(5).sort({ ts: -1 });

// Explain query execution
db.users.find({ email: "john@example.com" }).explain("executionStats");

// Check index usage
db.users.getIndexes();

// Monitor current operations
db.currentOp();

// Kill long-running operation
db.killOp(opId);
```

### SQL Query Optimization

```sql
-- Use EXPLAIN to understand query execution
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.name, p.title
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.created_at > '2023-01-01';

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename = 'users';

-- Monitor query performance
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## Docker & Container Debugging

### Container Inspection

```bash
# List running containers
docker ps

# Inspect container details
docker inspect container_name

# Check container logs
docker logs -f container_name

# Execute commands in running container
docker exec -it container_name /bin/bash

# Check container resource usage
docker stats container_name

# Copy files from/to container
docker cp container_name:/path/to/file ./local/path
docker cp ./local/file container_name:/path/to/destination
```

### Docker Compose Debugging

```bash
# View service logs
docker-compose logs service_name

# Follow logs for all services
docker-compose logs -f

# Check service status
docker-compose ps

# Rebuild and restart services
docker-compose down
docker-compose up --build

# Override command for debugging
docker-compose run --rm service_name /bin/bash
```

### Container Health Checks

```dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Check health status
docker inspect --format='{{.State.Health.Status}}' container_name
```

## Python Debugging

### Built-in Debugger (pdb)

```python
import pdb

def problematic_function(data):
    # Set breakpoint
    pdb.set_trace()

    result = process_data(data)
    return result

# Debugging commands in pdb:
# n - next line
# s - step into function
# c - continue execution
# l - list current code
# p variable_name - print variable
# pp variable_name - pretty print
# h - help
# q - quit debugger
```

### Logging for Debugging

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('debug.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def debug_function(data):
    logger.debug(f"Function called with data: {data}")

    try:
        result = risky_operation(data)
        logger.info(f"Operation successful: {result}")
        return result
    except Exception as e:
        logger.error(f"Operation failed: {e}", exc_info=True)
        raise

# Use different log levels
logger.debug("Detailed debugging info")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error occurred")
logger.critical("Critical error")
```

### Python Exception Handling

```python
import traceback
import sys

try:
    risky_operation()
except Exception as e:
    # Print full traceback
    traceback.print_exc()

    # Get traceback as string
    error_details = traceback.format_exc()
    logger.error(f"Error details: {error_details}")

    # Get exception info
    exc_type, exc_value, exc_traceback = sys.exc_info()
    print(f"Exception type: {exc_type.__name__}")
    print(f"Exception value: {exc_value}")
```

## Java Debugging

### Debugging with IDE

```java
// Set breakpoints and use IDE debugger
public class DebuggingExample {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("a", "b", "c");

        // Conditional breakpoint: right-click breakpoint, add condition
        for (int i = 0; i < items.size(); i++) {
            String item = items.get(i);
            System.out.println(item); // Breakpoint here
        }
    }
}
```

### JVM Debugging

```bash
# Enable remote debugging
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 MyApp

# Memory debugging
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof MyApp

# GC debugging
java -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -Xloggc:gc.log MyApp

# JVM monitoring
jps          # List Java processes
jstat -gc pid # GC statistics
jmap -histo pid # Heap histogram
jstack pid   # Thread dump
```

### Spring Boot Debugging

```java
@RestController
public class DebugController {

    private static final Logger logger = LoggerFactory.getLogger(DebugController.class);

    @GetMapping("/debug")
    public ResponseEntity<String> debugEndpoint() {
        logger.debug("Debug endpoint called");

        // Log method parameters and return values
        String result = performOperation();
        logger.info("Operation result: {}", result);

        return ResponseEntity.ok(result);
    }
}

# Enable debug logging in application.yml
logging:
  level:
    com.yourpackage: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
```

## Performance Debugging

### Frontend Performance

```javascript
// Measure performance
const start = performance.now();
expensiveOperation();
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);

// Monitor largest contentful paint
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log("LCP:", entry.startTime);
  }
}).observe({ entryTypes: ["largest-contentful-paint"] });

// Check memory usage
console.log("Memory usage:", performance.memory);
```

### Backend Performance

```python
import time
import psutil
from functools import wraps

def monitor_performance(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = psutil.Process().memory_info().rss / 1024 / 1024

        result = func(*args, **kwargs)

        end_time = time.time()
        end_memory = psutil.Process().memory_info().rss / 1024 / 1024

        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        print(f"Memory usage: {end_memory - start_memory:.2f} MB")

        return result
    return wrapper

@monitor_performance
def expensive_operation():
    # Your code here
    pass
```

## Network Debugging

### Common Network Tools

```bash
# Test connectivity
ping google.com
telnet hostname 80
nc -zv hostname 80-90  # Port scan

# DNS resolution
nslookup domain.com
dig domain.com
host domain.com

# Trace network path
traceroute google.com
mtr google.com

# Monitor network traffic
netstat -tuln  # Show listening ports
ss -tuln       # Modern alternative to netstat
lsof -i :8080  # Show what's using port 8080

# Check HTTP headers
curl -I https://example.com
wget --server-response https://example.com
```

### SSL/TLS Debugging

```bash
# Test SSL connection
openssl s_client -connect example.com:443

# Check certificate details
openssl x509 -in certificate.crt -text -noout

# Verify certificate chain
openssl verify -CAfile ca-bundle.crt certificate.crt

# Test specific SSL protocols
curl --tlsv1.2 https://example.com
curl --sslv3 https://example.com
```

## Environment-Specific Debugging

### Development Environment

- Use detailed logging
- Enable all debugging features
- Use development databases
- Disable caching for real-time updates

### Staging Environment

- Mirror production configuration
- Use production-like data volumes
- Enable monitoring and alerting
- Test deployment procedures

### Production Environment

- Implement proper logging levels
- Use monitoring and alerting
- Have rollback procedures ready
- Maintain debug information securely

## Emergency Debugging Checklist

### When Everything is Down

1. Check system status dashboard
2. Review recent deployments
3. Check monitoring alerts
4. Examine application logs
5. Verify database connectivity
6. Check network connectivity
7. Review resource utilization
8. Check for DDoS or security incidents

### Quick Health Checks

```bash
# System resources
top
df -h
free -m

# Service status
systemctl status service_name
docker ps
kubectl get pods

# Network connectivity
ping gateway
curl health_endpoint

# Database connectivity
psql -h db_host -U user -c "SELECT 1;"
redis-cli ping
```

Remember: Always debug systematically, document your findings, and share solutions with your team!
