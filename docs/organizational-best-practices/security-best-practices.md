# Security Best Practices

This file outlines essential security practices for protecting applications, data, and infrastructure.

## Application Security

### Input Validation

```python
# Always validate and sanitize user input
def create_user(user_data: dict):
    # Validate required fields
    if not user_data.get('email'):
        raise ValueError("Email is required")

    # Validate email format
    if not is_valid_email(user_data['email']):
        raise ValueError("Invalid email format")

    # Sanitize input
    clean_data = sanitize_input(user_data)
    return User.create(clean_data)
```

### SQL Injection Prevention

```python
# Good: Use parameterized queries
def get_user_by_id(user_id: int):
    query = "SELECT * FROM users WHERE id = %s"
    return db.execute(query, (user_id,))

# Bad: String concatenation
def get_user_by_id(user_id: int):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return db.execute(query)  # Vulnerable to SQL injection
```

### Cross-Site Scripting (XSS) Prevention

```javascript
// Escape user input in templates
function renderUserName(name) {
  return escapeHtml(name);
}

// Use Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'"
  );
  next();
});
```

## Authentication and Authorization

### Password Security

```python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed)
```

### JWT Best Practices

```python
import jwt
from datetime import datetime, timedelta

def create_jwt_token(user_id: int) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationError("Invalid token")
```

### Multi-Factor Authentication

```python
import pyotp

def setup_2fa(user_id: int) -> str:
    secret = pyotp.random_base32()
    # Store secret securely for user
    save_user_2fa_secret(user_id, secret)
    return secret

def verify_2fa_code(user_id: int, code: str) -> bool:
    secret = get_user_2fa_secret(user_id)
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)
```

## Data Protection

### Encryption at Rest

```python
from cryptography.fernet import Fernet

class DataEncryption:
    def __init__(self, key: bytes):
        self.cipher = Fernet(key)

    def encrypt(self, data: str) -> bytes:
        return self.cipher.encrypt(data.encode())

    def decrypt(self, encrypted_data: bytes) -> str:
        return self.cipher.decrypt(encrypted_data).decode()
```

### Encryption in Transit

```nginx
# Use HTTPS everywhere
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Data Anonymization

```python
import hashlib

def anonymize_email(email: str) -> str:
    """Convert email to irreversible hash"""
    return hashlib.sha256(email.encode()).hexdigest()

def pseudonymize_user_id(user_id: int, salt: str) -> str:
    """Convert user ID to reversible pseudonym"""
    return hashlib.sha256(f"{user_id}{salt}".encode()).hexdigest()
```

## Infrastructure Security

### Environment Variables

```bash
# Never commit secrets to version control
# Use environment variables for sensitive data
export DATABASE_URL="postgresql://user:pass@localhost/db"
export SECRET_KEY="your-secret-key"
export API_KEY="your-api-key"
```

### Container Security

```dockerfile
# Use non-root user
FROM node:16-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Scan for vulnerabilities
RUN npm audit --audit-level moderate
```

### Network Security

```yaml
# Implement proper firewall rules
firewall_rules:
  - port: 80
    protocol: tcp
    source: 0.0.0.0/0
  - port: 443
    protocol: tcp
    source: 0.0.0.0/0
  - port: 22
    protocol: tcp
    source: trusted_ips_only
```

## Security Monitoring

### Logging Security Events

```python
import logging

security_logger = logging.getLogger('security')

def log_failed_login(email: str, ip_address: str):
    security_logger.warning(f"Failed login attempt for {email} from {ip_address}")

def log_successful_login(user_id: int, ip_address: str):
    security_logger.info(f"User {user_id} logged in from {ip_address}")
```

### Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["1000 per hour"]
)

@app.route("/api/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    # Login logic here
    pass
```

## Security Checklist

### Development

- [ ] Input validation implemented
- [ ] Output encoding/escaping
- [ ] Parameterized queries used
- [ ] Authentication mechanisms in place
- [ ] Authorization checks implemented
- [ ] Secrets management configured

### Infrastructure

- [ ] HTTPS enabled everywhere
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup
- [ ] Incident response plan documented
