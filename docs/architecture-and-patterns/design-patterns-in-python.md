# Design Patterns in Python

This file explores common design patterns in Python with practical examples and use cases.

## Creational Patterns

### Singleton Pattern

Ensures only one instance of a class exists throughout the application.

```python
class DatabaseConnection:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.connection = None
        self._initialized = True

    def connect(self):
        if not self.connection:
            self.connection = psycopg2.connect(DATABASE_URL)
        return self.connection

# Usage
db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True - same instance

# Modern Python approach using decorator
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Logger:
    def __init__(self):
        self.logs = []

    def log(self, message):
        self.logs.append(f"{datetime.now()}: {message}")
```

### Factory Pattern

Creates objects without specifying their exact classes.

```python
from abc import ABC, abstractmethod

class DatabaseAdapter(ABC):
    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def execute(self, query):
        pass

class PostgreSQLAdapter(DatabaseAdapter):
    def connect(self):
        return psycopg2.connect(self.connection_string)

    def execute(self, query):
        with self.connect() as conn:
            return conn.execute(query)

class MySQLAdapter(DatabaseAdapter):
    def connect(self):
        return mysql.connector.connect(self.connection_string)

    def execute(self, query):
        with self.connect() as conn:
            return conn.execute(query)

class DatabaseFactory:
    @staticmethod
    def create_adapter(db_type: str) -> DatabaseAdapter:
        adapters = {
            'postgresql': PostgreSQLAdapter,
            'mysql': MySQLAdapter,
        }

        adapter_class = adapters.get(db_type.lower())
        if not adapter_class:
            raise ValueError(f"Unsupported database type: {db_type}")

        return adapter_class()

# Usage
db_adapter = DatabaseFactory.create_adapter('postgresql')
result = db_adapter.execute("SELECT * FROM users")
```

### Builder Pattern

Constructs complex objects step by step.

```python
class QueryBuilder:
    def __init__(self):
        self.reset()

    def reset(self):
        self._query = {
            'select': [],
            'from': None,
            'join': [],
            'where': [],
            'order_by': [],
            'limit': None
        }
        return self

    def select(self, *fields):
        self._query['select'].extend(fields)
        return self

    def from_table(self, table):
        self._query['from'] = table
        return self

    def join(self, table, condition):
        self._query['join'].append(f"JOIN {table} ON {condition}")
        return self

    def where(self, condition):
        self._query['where'].append(condition)
        return self

    def order_by(self, field, direction='ASC'):
        self._query['order_by'].append(f"{field} {direction}")
        return self

    def limit(self, count):
        self._query['limit'] = count
        return self

    def build(self):
        if not self._query['from']:
            raise ValueError("FROM clause is required")

        query_parts = []

        # SELECT
        select_clause = "SELECT " + (", ".join(self._query['select']) or "*")
        query_parts.append(select_clause)

        # FROM
        query_parts.append(f"FROM {self._query['from']}")

        # JOIN
        if self._query['join']:
            query_parts.extend(self._query['join'])

        # WHERE
        if self._query['where']:
            where_clause = "WHERE " + " AND ".join(self._query['where'])
            query_parts.append(where_clause)

        # ORDER BY
        if self._query['order_by']:
            order_clause = "ORDER BY " + ", ".join(self._query['order_by'])
            query_parts.append(order_clause)

        # LIMIT
        if self._query['limit']:
            query_parts.append(f"LIMIT {self._query['limit']}")

        return " ".join(query_parts)

# Usage
query = (QueryBuilder()
         .select('name', 'email')
         .from_table('users')
         .join('profiles', 'users.id = profiles.user_id')
         .where('users.active = true')
         .where('profiles.verified = true')
         .order_by('users.created_at', 'DESC')
         .limit(10)
         .build())

print(query)
# SELECT name, email FROM users JOIN profiles ON users.id = profiles.user_id
# WHERE users.active = true AND profiles.verified = true
# ORDER BY users.created_at DESC LIMIT 10
```

## Structural Patterns

### Adapter Pattern

Allows incompatible interfaces to work together.

```python
class LegacyPaymentSystem:
    def make_payment(self, amount):
        return f"Legacy payment of ${amount} processed"

class ModernPaymentSystem:
    def process_payment(self, amount, currency='USD'):
        return f"Modern payment of {amount} {currency} processed"

class PaymentAdapter:
    def __init__(self, legacy_system: LegacyPaymentSystem):
        self.legacy_system = legacy_system

    def process_payment(self, amount, currency='USD'):
        # Convert modern interface to legacy interface
        if currency != 'USD':
            # Convert currency logic here
            pass
        return self.legacy_system.make_payment(amount)

# Usage
legacy_payment = LegacyPaymentSystem()
adapter = PaymentAdapter(legacy_payment)

# Now we can use modern interface with legacy system
result = adapter.process_payment(100, 'USD')
print(result)  # Legacy payment of $100 processed
```

### Decorator Pattern

Adds behavior to objects dynamically without altering their structure.

```python
from functools import wraps
import time
import logging

# Function decorators
def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        time.sleep(delay)
                        continue
                    break
            raise last_exception
        return wrapper
    return decorator

def log_calls(logger=None):
    if logger is None:
        logger = logging.getLogger(__name__)

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
            try:
                result = func(*args, **kwargs)
                logger.info(f"{func.__name__} returned {result}")
                return result
            except Exception as e:
                logger.error(f"{func.__name__} raised {e}")
                raise
        return wrapper
    return decorator

# Class-based decorator
class RateLimiter:
    def __init__(self, max_calls=10, time_window=60):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = []

    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            # Remove old calls outside time window
            self.calls = [call_time for call_time in self.calls
                         if now - call_time < self.time_window]

            if len(self.calls) >= self.max_calls:
                raise Exception("Rate limit exceeded")

            self.calls.append(now)
            return func(*args, **kwargs)
        return wrapper

# Usage
@timer
@retry(max_attempts=3, delay=2)
@log_calls()
@RateLimiter(max_calls=5, time_window=60)
def api_call(endpoint):
    # Simulate API call
    import requests
    response = requests.get(f"https://api.example.com/{endpoint}")
    return response.json()
```

### Facade Pattern

Provides a simplified interface to a complex subsystem.

```python
class EmailService:
    def send_email(self, to, subject, body):
        print(f"Sending email to {to}: {subject}")

class SMSService:
    def send_sms(self, phone, message):
        print(f"Sending SMS to {phone}: {message}")

class PushNotificationService:
    def send_push(self, device_id, message):
        print(f"Sending push to {device_id}: {message}")

class NotificationFacade:
    def __init__(self):
        self.email_service = EmailService()
        self.sms_service = SMSService()
        self.push_service = PushNotificationService()

    def notify_user(self, user, message, channels=None):
        if channels is None:
            channels = ['email']  # Default channel

        if 'email' in channels and user.email:
            self.email_service.send_email(
                user.email,
                "Notification",
                message
            )

        if 'sms' in channels and user.phone:
            self.sms_service.send_sms(user.phone, message)

        if 'push' in channels and user.device_id:
            self.push_service.send_push(user.device_id, message)

    def send_welcome_message(self, user):
        welcome_msg = f"Welcome {user.name}! Thanks for joining us."
        self.notify_user(user, welcome_msg, ['email', 'push'])

    def send_urgent_alert(self, user, alert_message):
        self.notify_user(user, alert_message, ['email', 'sms', 'push'])

# Usage
notification_system = NotificationFacade()
user = User(name="John", email="john@example.com", phone="+1234567890")
notification_system.send_welcome_message(user)
```

## Behavioral Patterns

### Observer Pattern

Defines a one-to-many dependency between objects.

```python
from abc import ABC, abstractmethod
from typing import List

class Observer(ABC):
    @abstractmethod
    def update(self, subject, event_data):
        pass

class Subject:
    def __init__(self):
        self._observers: List[Observer] = []

    def attach(self, observer: Observer):
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer: Observer):
        if observer in self._observers:
            self._observers.remove(observer)

    def notify(self, event_data=None):
        for observer in self._observers:
            observer.update(self, event_data)

class User(Subject):
    def __init__(self, name, email):
        super().__init__()
        self.name = name
        self.email = email
        self._status = "offline"

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        old_status = self._status
        self._status = value
        self.notify({
            'event': 'status_changed',
            'old_status': old_status,
            'new_status': value,
            'user': self
        })

class EmailNotifier(Observer):
    def update(self, subject, event_data):
        if event_data['event'] == 'status_changed':
            user = event_data['user']
            print(f"Email: {user.name} status changed to {event_data['new_status']}")

class ActivityLogger(Observer):
    def __init__(self):
        self.log = []

    def update(self, subject, event_data):
        if event_data['event'] == 'status_changed':
            user = event_data['user']
            log_entry = f"{time.time()}: {user.name} {event_data['old_status']} -> {event_data['new_status']}"
            self.log.append(log_entry)
            print(f"Log: {log_entry}")

# Usage
user = User("Alice", "alice@example.com")
email_notifier = EmailNotifier()
logger = ActivityLogger()

user.attach(email_notifier)
user.attach(logger)

user.status = "online"   # Triggers notifications
user.status = "away"     # Triggers notifications
```

### Strategy Pattern

Defines a family of algorithms and makes them interchangeable.

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number, cvv, expiry):
        self.card_number = card_number
        self.cvv = cvv
        self.expiry = expiry

    def pay(self, amount):
        return f"Paid ${amount} using Credit Card ending in {self.card_number[-4:]}"

class PayPalPayment(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        return f"Paid ${amount} using PayPal account {self.email}"

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet_address, currency):
        self.wallet_address = wallet_address
        self.currency = currency

    def pay(self, amount):
        return f"Paid {amount} {self.currency} to wallet {self.wallet_address[:8]}..."

class PaymentProcessor:
    def __init__(self):
        self._strategy = None

    def set_payment_method(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def process_payment(self, amount):
        if not self._strategy:
            raise ValueError("Payment method not set")
        return self._strategy.pay(amount)

# Usage
processor = PaymentProcessor()

# Credit card payment
credit_card = CreditCardPayment("1234567890123456", "123", "12/25")
processor.set_payment_method(credit_card)
result1 = processor.process_payment(100)
print(result1)

# PayPal payment
paypal = PayPalPayment("user@example.com")
processor.set_payment_method(paypal)
result2 = processor.process_payment(100)
print(result2)
```

### Command Pattern

Encapsulates requests as objects, allowing you to parameterize clients with different requests.

```python
from abc import ABC, abstractmethod
from typing import List

class Command(ABC):
    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass

class Light:
    def __init__(self, location):
        self.location = location
        self.is_on = False

    def turn_on(self):
        self.is_on = True
        print(f"{self.location} light is ON")

    def turn_off(self):
        self.is_on = False
        print(f"{self.location} light is OFF")

class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_on()

    def undo(self):
        self.light.turn_off()

class LightOffCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.turn_off()

    def undo(self):
        self.light.turn_on()

class MacroCommand(Command):
    def __init__(self, commands: List[Command]):
        self.commands = commands

    def execute(self):
        for command in self.commands:
            command.execute()

    def undo(self):
        # Undo in reverse order
        for command in reversed(self.commands):
            command.undo()

class RemoteControl:
    def __init__(self):
        self.commands = {}
        self.last_command = None

    def set_command(self, slot, command: Command):
        self.commands[slot] = command

    def press_button(self, slot):
        if slot in self.commands:
            command = self.commands[slot]
            command.execute()
            self.last_command = command

    def press_undo(self):
        if self.last_command:
            self.last_command.undo()

# Usage
living_room_light = Light("Living Room")
kitchen_light = Light("Kitchen")

living_room_on = LightOnCommand(living_room_light)
living_room_off = LightOffCommand(living_room_light)
kitchen_on = LightOnCommand(kitchen_light)
kitchen_off = LightOffCommand(kitchen_light)

# Macro command for "Party Mode"
party_mode = MacroCommand([living_room_on, kitchen_on])

remote = RemoteControl()
remote.set_command(1, living_room_on)
remote.set_command(2, living_room_off)
remote.set_command(3, party_mode)

remote.press_button(1)  # Turn on living room light
remote.press_undo()     # Turn off living room light
remote.press_button(3)  # Party mode - turn on all lights
remote.press_undo()     # Undo party mode - turn off all lights
```

## Python-Specific Patterns

### Context Manager Pattern

Manages resources properly using the `with` statement.

```python
class DatabaseConnection:
    def __init__(self, host, port, database):
        self.host = host
        self.port = port
        self.database = database
        self.connection = None

    def __enter__(self):
        self.connection = psycopg2.connect(
            host=self.host,
            port=self.port,
            database=self.database
        )
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            if exc_type is None:
                self.connection.commit()
            else:
                self.connection.rollback()
            self.connection.close()
        return False  # Don't suppress exceptions

# Usage
with DatabaseConnection('localhost', 5432, 'mydb') as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
# Connection automatically closed and committed/rolled back

# Using contextlib
from contextlib import contextmanager

@contextmanager
def timer_context(operation_name):
    start_time = time.time()
    print(f"Starting {operation_name}...")
    try:
        yield
    finally:
        end_time = time.time()
        print(f"{operation_name} completed in {end_time - start_time:.2f} seconds")

# Usage
with timer_context("Database query"):
    time.sleep(2)  # Simulate work
```

### Dependency Injection Pattern

Provides dependencies from external sources rather than creating them internally.

```python
from abc import ABC, abstractmethod
from typing import Dict, Type, Any

class Repository(ABC):
    @abstractmethod
    def save(self, entity):
        pass

    @abstractmethod
    def find_by_id(self, id):
        pass

class DatabaseRepository(Repository):
    def __init__(self, connection):
        self.connection = connection

    def save(self, entity):
        # Database save logic
        print(f"Saving {entity} to database")

    def find_by_id(self, id):
        # Database query logic
        print(f"Finding entity with id {id} from database")
        return f"Entity_{id}"

class InMemoryRepository(Repository):
    def __init__(self):
        self.data = {}

    def save(self, entity):
        self.data[entity.id] = entity
        print(f"Saving {entity} to memory")

    def find_by_id(self, id):
        return self.data.get(id)

class UserService:
    def __init__(self, repository: Repository):
        self.repository = repository

    def create_user(self, user_data):
        user = User(user_data)
        self.repository.save(user)
        return user

    def get_user(self, user_id):
        return self.repository.find_by_id(user_id)

# Simple DI Container
class DIContainer:
    def __init__(self):
        self._services: Dict[str, Any] = {}
        self._singletons: Dict[str, Any] = {}

    def register(self, name: str, factory, singleton=False):
        self._services[name] = (factory, singleton)

    def get(self, name: str):
        if name not in self._services:
            raise ValueError(f"Service '{name}' not registered")

        factory, is_singleton = self._services[name]

        if is_singleton:
            if name not in self._singletons:
                self._singletons[name] = factory()
            return self._singletons[name]

        return factory()

# Setup container
container = DIContainer()
container.register('repository',
                  lambda: DatabaseRepository(connection="db_conn"),
                  singleton=True)
container.register('user_service',
                  lambda: UserService(container.get('repository')))

# Usage
user_service = container.get('user_service')
user = user_service.create_user({'name': 'John', 'email': 'john@example.com'})
```

## Best Practices

### When to Use Each Pattern

1. **Singleton**: Use sparingly, mainly for logging, configuration, or connection pools
2. **Factory**: When you need to create objects based on conditions or configuration
3. **Builder**: For complex objects with many optional parameters
4. **Observer**: For event-driven systems and loose coupling
5. **Strategy**: When you have multiple algorithms for the same task
6. **Command**: For undo/redo functionality or queuing operations
7. **Decorator**: For adding functionality without modifying existing code

### Anti-patterns to Avoid

```python
# God Object - does too much
class UserManager:
    def authenticate(self, user): pass
    def send_email(self, user): pass
    def log_activity(self, user): pass
    def encrypt_password(self, password): pass
    def validate_input(self, data): pass
    # ... 50 more methods

# Spaghetti Code - unclear dependencies
def process_user(data):
    if validate_data(data):
        user = create_user(data)
        if send_welcome_email(user):
            if log_user_creation(user):
                return update_statistics(user)
    return None

# Better: Use proper separation of concerns
class UserService:
    def __init__(self, validator, repository, email_service, logger):
        self.validator = validator
        self.repository = repository
        self.email_service = email_service
        self.logger = logger

    def create_user(self, data):
        if not self.validator.validate(data):
            raise ValidationError("Invalid user data")

        user = User(data)
        self.repository.save(user)
        self.email_service.send_welcome_email(user)
        self.logger.log_user_creation(user)

        return user
```

### Testing Patterns

```python
# Dependency injection makes testing easier
class TestUserService:
    def test_create_user(self):
        # Arrange
        mock_repository = Mock(spec=Repository)
        mock_email_service = Mock()
        mock_logger = Mock()

        user_service = UserService(
            validator=AlwaysValidValidator(),
            repository=mock_repository,
            email_service=mock_email_service,
            logger=mock_logger
        )

        # Act
        user = user_service.create_user({'name': 'Test', 'email': 'test@example.com'})

        # Assert
        mock_repository.save.assert_called_once()
        mock_email_service.send_welcome_email.assert_called_once_with(user)
        mock_logger.log_user_creation.assert_called_once_with(user)
```

Design patterns provide proven solutions to common programming problems. Choose patterns based on your specific needs and avoid over-engineering simple solutions.
