# How to Install the `tree` Library to Display Directory Structure in the Terminal

The `tree` command-line utility allows you to visualize directory structures in a tree-like format directly in your terminal. Below are installation instructions for **macOS**, **Linux**, and **Windows (via WSL or package managers)**.

---

## macOS

### Using Homebrew

1. **Open Terminal**.
2. **Install tree** by running:
   ```bash
   brew install tree
   ```
3. **Verify installation**:
   ```bash
   tree --version
   ```

---

## Linux (Debian/Ubuntu)

1. **Open Terminal**.
2. **Install tree** using APT:
   ```bash
   sudo apt-get update
   sudo apt-get install tree
   ```
3. **Verify installation**:
   ```bash
   tree --version
   ```

---

## Windows

### Option 1: Using Chocolatey

1. **Open PowerShell as Administrator**.
2. **Install tree** by running:
   ```powershell
   choco install tree
   ```
3. **Verify installation**:
   ```powershell
   tree /?
   ```

### Option 2: Using Scoop

1. **Open PowerShell**.
2. **Install tree** by running:
   ```powershell
   scoop install tree
   ```
3. **Verify installation**:
   ```powershell
   tree /?
   ```

### Option 3: Using Windows Subsystem for Linux (WSL)

- Follow the **Linux** installation steps in your WSL terminal.

---

## Usage Example

### Command:

To display the directory tree of the current folder, simply run:

```bash
tree
```

### Output Example:

Here is an example output for a directory containing multiple files and subdirectories:

```
.
├── LICENSE
├── README.md
├── docs
│   ├── architecture.md
├── requirements.txt
└── src
    ├── __init__.py
    ├── app
    │   ├── __init__.py
    │   ├── app.py
    │   ├── config
    │   │   ├── __init__.py
    │   │   ├── app_config.py
    │   │   ├── config_dev.yml
    │   │   ├── config_local.yml
    │   │   └── paths.py
    │   ├── features
    │   │   ├── __init__.py
    │   │   └── domain
    │   │       ├── __init__.py
    │   │       ├── entities
    │   │       │   ├── __init__.py
    │   │       │   └── user_entity.py
    │   │       ├── repositories
    │   │       │   ├── __init__.py
    │   │       │   └── user_repository.py
    │   │       └── value_objects
    │   │           ├── __init__.py
    │   │           └── email.py
    │   └── gunicorn_conf.py
    ├── main.py
    └── shared
        ├── __init__.py
        ├── domain
        │   ├── __init__.py
        │   ├── entities
        │   │   ├── __init__.py
        │   │   └── base_entity.py
        │   ├── repositories
        │   │   ├── __init__.py
        │   │   └── base_repository.py
        │   └── value_objects
        │       ├── __init__.py
        │       └── entity_id.py
        ├── global_variables.py
        └── utils
            ├── config_util.py
            ├── date_util.py
            ├── log_util.py
            ├── retry_decorator.py
            └── uuid_util.py

17 directories, 44 files
```

---
