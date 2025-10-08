# Installing and Setting Up VS Code

This file provides comprehensive instructions for installing and configuring Visual Studio Code for modern development.

## Installation

### System Requirements
- **RAM**: 4 GB minimum, 8 GB recommended
- **CPU**: 1.6 GHz processor
- **Disk Space**: 200 MB for installation
- **OS**: Windows 10+, macOS 10.15+, Linux

### Installation Methods

#### Official Installers
```bash
# Download from: https://code.visualstudio.com/

# Windows
# Download: VSCodeUserSetup-x64-1.x.x.exe
# Run installer with admin privileges

# macOS
# Download: VSCode-darwin-universal.zip
# Extract and drag to Applications folder

# Linux (Debian/Ubuntu)
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install code
```

#### Package Managers
```bash
# macOS via Homebrew
brew install --cask visual-studio-code

# Windows via Chocolatey
choco install vscode

# Windows via Winget
winget install Microsoft.VisualStudioCode

# Linux via Snap
sudo snap install code --classic

# Arch Linux via AUR
yay -S visual-studio-code-bin
```

## Essential Extensions

### Core Development Extensions
```json
{
  "recommendations": [
    // Language Support
    "ms-python.python",
    "ms-python.pylint",
    "ms-python.black-formatter",
    "ms-python.isort",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-eslint",
    "esbenp.prettier-vscode",
    
    // Frameworks
    "ms-vscode.vscode-spring-initializr",
    "vmware.vscode-spring-boot",
    "vscjava.vscode-java-pack",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native",
    
    // Productivity
    "ms-vscode.vscode-github-copilot",
    "ms-vscode.vscode-github-copilot-chat",
    "eamodio.gitlens",
    "ms-vscode.vscode-pull-request-github",
    "github.vscode-github-actions",
    
    // Database
    "ms-mssql.mssql",
    "ms-vscode.vscode-postgres",
    "mongodb.mongodb-vscode",
    
    // Docker & Cloud
    "ms-azuretools.vscode-docker",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "amazonwebservices.aws-toolkit-vscode",
    
    // Utilities
    "ms-vscode.vscode-live-server",
    "ms-vscode.vscode-thunder-client",
    "ms-vscode.vscode-todo-highlight",
    "ms-vscode.vscode-bracket-pair-colorizer-2",
    "ms-vscode.vscode-auto-rename-tag"
  ]
}
```

### Installation via Command Palette
```bash
# Open Command Palette: Ctrl+Shift+P (Cmd+Shift+P on macOS)
# Type: Extensions: Install Extensions
# Search and install extensions

# Or via command line
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension eamodio.gitlens
```

## Workspace Configuration

### Settings JSON
```json
{
  // Editor settings
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "editor.rulers": [80, 120],
  "editor.minimap.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  
  // Files settings
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/venv": true,
    "**/env": true,
    "**/.venv": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true,
    "**/.nuxt": true,
    "**/coverage": true
  },
  
  // Terminal settings
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Fira Code', 'Cascadia Code'",
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.copyOnSelection": true,
  
  // Git settings
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "git.openRepositoryInParentFolders": "always",
  
  // Language-specific settings
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    },
    "editor.tabSize": 4
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[yaml]": {
    "editor.tabSize": 2
  },
  "[java]": {
    "editor.tabSize": 4
  },
  
  // Python specific
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.testing.pytestEnabled": true,
  "python.testing.autoTestDiscoverOnSaveEnabled": true,
  
  // JavaScript/TypeScript
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  
  // Extension settings
  "gitlens.codeLens.enabled": false,
  "gitlens.currentLine.enabled": false,
  "prettier.requireConfig": true,
  "eslint.workingDirectories": ["./"],
  "todo-highlight.keywords": [
    "DEBUG:",
    "REVIEW:",
    {
      "text": "NOTE:",
      "color": "#ff0000",
      "backgroundColor": "yellow",
      "overviewRulerColor": "grey"
    },
    {
      "text": "HACK:",
      "color": "#000",
      "isWholeLine": false
    },
    {
      "text": "TODO:",
      "color": "red",
      "border": "1px solid red",
      "borderRadius": "2px",
      "backgroundColor": "rgba(255,0,0,0.2)"
    }
  ]
}
```

### Workspace-specific Settings
```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.testing.pytestArgs": [
    "tests"
  ],
  "python.testing.unittestEnabled": false,
  "python.testing.pytestEnabled": true,
  "python.linting.pylintArgs": [
    "--load-plugins=pylint_django"
  ],
  "eslint.workingDirectories": ["frontend/"],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Language-Specific Setup

### Python Development
```python
# requirements-dev.txt
black==23.11.0
pylint==3.0.3
pytest==7.4.3
pytest-cov==4.1.0
mypy==1.7.1
isort==5.12.0

# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py39']
include = '\.pyi?$'
extend-exclude = '''
/(
  migrations
)/
'''

[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88
known_django = "django"
sections = ["FUTURE", "STDLIB", "DJANGO", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]

[tool.pylint.messages_control]
disable = "C0330, C0326"

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "myproject.settings.test"
python_files = ["test_*.py", "*_test.py", "testing/*/test*.py"]
addopts = "-v --tb=short --cov=app --cov-report=html"
```

### JavaScript/TypeScript Setup
```json
// package.json
{
  "scripts": {
    "lint": "eslint src/**/*.{js,jsx,ts,tsx}",
    "lint:fix": "eslint src/**/*.{js,jsx,ts,tsx} --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,ts,tsx,json,css,md}"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.0"
  }
}

// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Java Development
```xml
<!-- pom.xml -->
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

## Debugging Configuration

### Launch Configurations
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Django",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/manage.py",
      "args": ["runserver", "127.0.0.1:8000"],
      "django": true,
      "autoReload": {
        "enable": true
      },
      "env": {
        "DJANGO_SETTINGS_MODULE": "myproject.settings.development"
      }
    },
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
      "env": {
        "ENV": "development"
      }
    },
    {
      "name": "Node.js: Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.js",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Node.js: Attach",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "React: Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

### Tasks Configuration
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Python: Run Tests",
      "type": "shell",
      "command": "python",
      "args": ["-m", "pytest", "tests/", "-v"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Python: Format Code",
      "type": "shell",
      "command": "black",
      "args": ["."],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "silent"
      }
    },
    {
      "label": "npm: install",
      "type": "npm",
      "script": "install",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "npm: start",
      "type": "npm",
      "script": "start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Docker: Build",
      "type": "shell",
      "command": "docker",
      "args": ["build", "-t", "${workspaceFolderBasename}", "."],
      "group": "build"
    }
  ]
}
```

## Snippets and Shortcuts

### Custom Code Snippets
```json
// .vscode/python.json
{
  "Python Class": {
    "prefix": "class",
    "body": [
      "class ${1:ClassName}:",
      "    \"\"\"${2:Class description}.\"\"\"",
      "    ",
      "    def __init__(self):",
      "        ${3:pass}",
      "    ",
      "    def ${4:method_name}(self):",
      "        \"\"\"${5:Method description}.\"\"\"",
      "        ${6:pass}"
    ],
    "description": "Python class template"
  },
  "Django Model": {
    "prefix": "djangomodel",
    "body": [
      "class ${1:ModelName}(models.Model):",
      "    \"\"\"${2:Model description}.\"\"\"",
      "    ",
      "    ${3:name} = models.CharField(max_length=${4:100})",
      "    created_at = models.DateTimeField(auto_now_add=True)",
      "    updated_at = models.DateTimeField(auto_now=True)",
      "    ",
      "    class Meta:",
      "        db_table = '${5:table_name}'",
      "        ordering = ['${6:created_at}']",
      "    ",
      "    def __str__(self):",
      "        return self.${7:name}"
    ],
    "description": "Django model template"
  },
  "FastAPI Route": {
    "prefix": "fastapiroute",
    "body": [
      "@router.${1:get}(\"/${2:endpoint}\")",
      "async def ${3:function_name}():",
      "    \"\"\"${4:Route description}.\"\"\"",
      "    ${5:pass}"
    ],
    "description": "FastAPI route template"
  }
}

// .vscode/javascript.json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:prop}: ${3:string};",
      "}",
      "",
      "const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${2:prop} }) => {",
      "  return (",
      "    <div>",
      "      ${4:JSX content}",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ],
    "description": "React functional component with TypeScript"
  }
}
```

### Keyboard Shortcuts
```json
// keybindings.json
[
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.reloadWindow"
  },
  {
    "key": "ctrl+k ctrl+t",
    "command": "workbench.action.selectTheme"
  },
  {
    "key": "ctrl+shift+e",
    "command": "workbench.view.explorer"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.view.search"
  },
  {
    "key": "ctrl+shift+g",
    "command": "workbench.view.scm"
  },
  {
    "key": "ctrl+shift+d",
    "command": "workbench.view.debug"
  },
  {
    "key": "ctrl+shift+x",
    "command": "workbench.view.extensions"
  },
  {
    "key": "ctrl+shift+`",
    "command": "workbench.action.terminal.new"
  },
  {
    "key": "ctrl+shift+p",
    "command": "workbench.action.showCommands"
  },
  {
    "key": "ctrl+p",
    "command": "workbench.action.quickOpen"
  }
]
```

## Docker Integration

### Docker Support
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Development Containers
```json
// .devcontainer/devcontainer.json
{
  "name": "Python 3",
  "image": "mcr.microsoft.com/vscode/devcontainers/python:3.9",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-python.python",
        "ms-python.pylint",
        "ms-azuretools.vscode-docker"
      ]
    }
  },
  "postCreateCommand": "pip install -r requirements.txt",
  "remoteUser": "vscode"
}
```

## Performance Optimization

### Large Projects
```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/venv/**": true,
    "**/env/**": true,
    "**/__pycache__/**": true,
    "**/dist/**": true,
    "**/build/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/venv": true,
    "**/env": true,
    "**/__pycache__": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true
  },
  "files.associations": {
    "*.env.*": "dotenv"
  }
}
```

This comprehensive VS Code setup provides an excellent development environment for multiple languages and frameworks.