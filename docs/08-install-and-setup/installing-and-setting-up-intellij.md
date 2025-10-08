# Installing and Setting Up IntelliJ IDEA

This file provides comprehensive instructions for installing and configuring IntelliJ IDEA for optimal development experience.

## Installation

### System Requirements
- **RAM**: 8 GB minimum, 16 GB recommended
- **CPU**: Multi-core processor
- **Disk Space**: 3.5 GB for IDE, additional for projects
- **OS**: Windows 10+, macOS 10.14+, Linux with glibc 2.17+

### Download and Install

#### JetBrains Toolbox (Recommended)
```bash
# Download JetBrains Toolbox
# Visit: https://www.jetbrains.com/toolbox-app/

# Install via Toolbox for easy version management
# Benefits:
# - Easy updates
# - Multiple versions
# - License management
# - Project management
```

#### Direct Installation
```bash
# macOS via Homebrew
brew install --cask intellij-idea

# Windows via Chocolatey
choco install intellijidea-community

# Linux via Snap
sudo snap install intellij-idea-community --classic

# Manual installation
# Download from: https://www.jetbrains.com/idea/download/
```

## Initial Setup

### First Launch Configuration
1. **Import Settings**: Choose whether to import from previous installation
2. **UI Theme**: Select Darcula (dark) or IntelliJ (light)
3. **Keymap**: Choose your preferred keymap (Default, Eclipse, VS Code, etc.)
4. **Plugins**: Install essential plugins during setup

### Essential Configuration

#### JDK Configuration
```bash
# Set Project SDK
File → Project Structure → SDKs → Add JDK

# Recommended JDKs:
# - Amazon Corretto (LTS versions)
# - Eclipse Adoptium (formerly AdoptOpenJDK)
# - Oracle JDK
# - GraalVM (for advanced use cases)

# Download JDK directly in IntelliJ:
File → Project Structure → SDKs → Add JDK → Download JDK
```

#### Project Templates
```bash
# Configure project templates
File → New Projects Setup → Preferences for New Projects

# Set default:
# - Project SDK
# - Build tools (Maven/Gradle)
# - Version control (Git)
# - Code style
```

## Essential Plugins

### Development Plugins
```bash
# Core Development
- Lombok              # Reduces boilerplate code
- Spring Boot         # Spring Boot support
- Database Tools      # Database integration
- Maven Helper        # Maven dependency analysis
- Gradle              # Gradle build tool support

# Code Quality
- SonarLint          # Code quality analysis
- SpotBugs           # Bug detection
- Checkstyle-IDEA    # Code style checking
- PMDPlugin          # Code analysis

# Productivity
- Key Promoter X     # Learn keyboard shortcuts
- Rainbow Brackets   # Colorful brackets
- Nyan Progress Bar  # Fun progress bar
- GitToolBox         # Enhanced Git integration
```

### Installation via Settings
```bash
# Install plugins
File → Settings → Plugins → Marketplace

# Search and install plugins
# Restart IDE when prompted
```

### Language-Specific Plugins
```bash
# JavaScript/TypeScript
- JavaScript and TypeScript
- Node.js
- React

# Python (IntelliJ Ultimate)
- Python
- Python Community Edition

# Database
- Database Tools and SQL (Ultimate)
- SQL (Community)

# Docker
- Docker
- Kubernetes

# Cloud
- AWS Toolkit
- Google Cloud Tools
- Azure Toolkit
```

## Code Style Configuration

### Java Code Style
```java
// Settings → Editor → Code Style → Java

// Tabs and Indents
Tab size: 4
Indent: 4
Continuation indent: 8
Use tab character: false

// Spaces
Before parentheses:
- Method declaration: false
- Method call: false
- if/for/while/switch: true
- try/catch/finally/synchronized: true

// Wrapping and Braces
Keep when reformatting:
- Line breaks: true
- Comment at first column: true
- Simple blocks in one line: false

// Import optimization
Class count to use import with '*': 5
Names count to use static import with '*': 3

// Order of imports:
1. java.*
2. javax.*
3. org.*
4. com.*
5. all other imports
6. static imports
```

### Spring Boot Specific Configuration
```bash
# Enable Spring Boot features
File → Settings → Build, Execution, Deployment → Build Tools → Maven
- Import Maven projects automatically
- Sources and documentation automatically

# Spring Boot settings
File → Settings → Frameworks → Spring Boot
- Enable Spring Boot auto-configuration
```

## Live Templates

### Custom Live Templates
```java
// Settings → Editor → Live Templates

// Create template group: "Custom Java"

// psvm - main method
public static void main(String[] args) {
    $END$
}

// sout - System.out.println
System.out.println($EXPR$);

// fori - for loop with index
for (int $INDEX$ = 0; $INDEX$ < $LIMIT$; $INDEX$++) {
    $END$
}

// trycatch - try-catch block
try {
    $SELECTION$
} catch ($EXCEPTION$ e) {
    $END$
}

// logger - SLF4J logger
private static final Logger logger = LoggerFactory.getLogger($CLASS$.class);

// test - JUnit test method
@Test
void $METHOD_NAME$() {
    // given
    $GIVEN$
    
    // when
    $WHEN$
    
    // then
    $THEN$
}
```

### Spring Boot Live Templates
```java
// @service - Spring Service
@Service
public class $NAME$ {
    $END$
}

// @restcontroller - REST Controller
@RestController
@RequestMapping("$PATH$")
public class $NAME$ {
    $END$
}

// @entity - JPA Entity
@Entity
@Table(name = "$TABLE$")
public class $NAME$ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    $END$
}
```

## Debugging Configuration

### Debug Templates
```java
// Run/Debug Configurations
Run → Edit Configurations

// Application configuration
Main class: com.example.Application
VM options: -Xmx2g -Xms1g
Program arguments: --spring.profiles.active=dev
Environment variables: DB_PASSWORD=secret

// JUnit configuration
Test kind: All in package
Package: com.example.service
VM options: -ea
```

### Remote Debugging
```bash
# Add remote debug configuration
Run → Edit Configurations → Add → Remote JVM Debug

# Settings:
Host: localhost
Port: 5005
Command line args: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005

# Start application with debug args
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar app.jar
```

## Database Integration

### Database Connection
```bash
# Database tool window
View → Tool Windows → Database

# Add data source
Database → + → Data Source → PostgreSQL/MySQL/etc.

# Connection settings:
Host: localhost
Port: 5432
Database: myapp
User: postgres
Password: password

# Test connection and download drivers
```

### SQL Console Configuration
```sql
-- Settings → Database → Query Execution
-- Enable:
-- - Auto-commit
-- - Execute in background
-- - Show execution time

-- Useful shortcuts:
-- Ctrl+Enter: Execute statement
-- Ctrl+Shift+Enter: Execute all
-- Ctrl+/: Comment/uncomment
-- Ctrl+Space: Code completion
```

## Version Control Integration

### Git Configuration
```bash
# Settings → Version Control → Git
Path to Git executable: /usr/bin/git (auto-detected)

# Configure Git options:
- Use credential helper: true
- Add suffix to cherry-picked commits: true
- Warn if CRLF line separators are about to be committed: true

# SSH configuration
Settings → Version Control → Git → SSH
- Use built-in SSH client
- SSH executable: Built-in
```

### GitHub Integration
```bash
# Settings → Version Control → GitHub
Add account: 
- Token-based authentication (recommended)
- Generate token at: https://github.com/settings/tokens

# Permissions needed:
- repo (full repository access)
- user:email (access user email)
- read:org (read organization membership)
```

## Performance Optimization

### Memory Settings
```bash
# Increase heap size
Help → Edit Custom VM Options

# Add to idea.vmoptions:
-Xmx4g
-Xms2g
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+UnlockExperimentalVMOptions
-XX:+UseCGroupMemoryLimitForHeap

# For large projects:
-Xmx8g
-Xms4g
```

### Indexing Optimization
```bash
# Settings → Directories
# Mark directories appropriately:
- Sources: src/main/java
- Test Sources: src/test/java
- Resources: src/main/resources
- Test Resources: src/test/resources
- Excluded: target, build, .git, .idea

# Exclude large directories from indexing
```

### Build Performance
```bash
# Settings → Build, Execution, Deployment → Compiler
Build process heap size: 2048 MB
User-local build process VM options: -Dfile.encoding=UTF-8

# Gradle settings
Settings → Build Tools → Gradle
Build and run using: Gradle
Run tests using: Gradle
Gradle JVM: Project SDK
```

## Keyboard Shortcuts

### Essential Shortcuts
```bash
# Navigation
Ctrl+N          # Find class
Ctrl+Shift+N    # Find file
Ctrl+Shift+A    # Find action
Ctrl+E          # Recent files
Ctrl+G          # Go to line

# Editing
Ctrl+D          # Duplicate line
Ctrl+Y          # Delete line
Ctrl+Shift+U    # Toggle case
Ctrl+/          # Comment line
Ctrl+Shift+/    # Block comment

# Refactoring
Shift+F6        # Rename
Ctrl+Alt+V      # Extract variable
Ctrl+Alt+M      # Extract method
F6              # Move
Ctrl+Alt+L      # Reformat code

# Running and Debugging
Shift+F10       # Run
Shift+F9        # Debug
Ctrl+F2         # Stop
F8              # Step over
F7              # Step into
```

### Custom Keymap
```bash
# Create custom keymap
Settings → Keymap → Copy default keymap

# Useful customizations:
Ctrl+Shift+T    # Create test
Ctrl+Alt+T      # Surround with
Ctrl+Shift+V    # Paste from history
Alt+Insert      # Generate code
```

## Project Templates

### Spring Boot Template
```bash
# Create custom project template
File → Export to Zip File
File → Import Project → From ZIP

# Template structure:
project-template/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/app/
│   │   │       ├── Application.java
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       └── repository/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-dev.yml
│   └── test/
├── pom.xml
└── README.md
```

## Troubleshooting

### Common Issues

#### Out of Memory
```bash
# Symptoms: IDE becomes slow, freezes
# Solution: Increase heap size in idea.vmoptions
-Xmx8g
-Xms4g
```

#### Slow Indexing
```bash
# Symptoms: Long indexing times
# Solutions:
1. Exclude unnecessary directories
2. Increase indexing heap size
3. Use SSD storage
4. Close unused projects
```

#### Plugin Conflicts
```bash
# Symptoms: IDE crashes, features not working
# Solutions:
1. Disable conflicting plugins
2. Update plugins to latest versions
3. Reset to default plugin set
4. Safe mode: Help → Troubleshoot → Start IDE in Safe Mode
```

#### Git Integration Issues
```bash
# Symptoms: Git operations fail
# Solutions:
1. Check Git executable path
2. Verify SSH key configuration
3. Clear Git cache: VCS → Git → Reset Git Cache
4. Re-clone repository
```

### Performance Monitoring
```bash
# Monitor IDE performance
Help → Diagnostic Tools → Activity Monitor

# Check:
- Memory usage
- CPU usage
- Thread dumps
- Event log errors

# Generate thread dump for analysis
Help → Diagnostic Tools → Capture Thread Dump
```

## Advanced Features

### Code Inspections
```bash
# Settings → Editor → Inspections
# Enable useful inspections:
- Probable bugs
- Performance issues
- Security vulnerabilities
- Code style issues

# Custom inspection profiles
# Create team-specific inspection profiles
```

### Structural Search and Replace
```bash
# Edit → Find → Search Structurally
# Powerful pattern-based search and replace

# Example: Find all empty catch blocks
try {
    $statement$
} catch($exception$ $ex$) {
}

# Replace with proper logging
try {
    $statement$
} catch($exception$ $ex$) {
    log.error("Error occurred", $ex$);
}
```

This comprehensive setup will provide an optimal IntelliJ IDEA development environment for Java and Spring Boot development.