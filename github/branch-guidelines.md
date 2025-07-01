# 🌿 Branch Naming Guidelines

To keep our repositories clean, understandable, and collaboration-friendly, we follow a consistent naming convention for Git branches.

---

## 🧪 Naming Format

```text
<type>/<short-description>
```

- `<type>` is the category of work being done
- `<short-description>` is a lowercase, hyphen-separated summary of the change

---

## ✅ Accepted Branch Types

| Type       | Description                                     | Example                          |
| ---------- | ----------------------------------------------- | -------------------------------- |
| `feature`  | New feature or enhancement                      | `feature/user-authentication`    |
| `bugfix`   | Fixing a bug or issue                           | `bugfix/login-validation-error`  |
| `refactor` | Internal code improvements without new behavior | `refactor/db-connection-handler` |
| `docs`     | Changes or additions to documentation           | `docs/add-api-usage-guide`       |
| `chore`    | Routine tasks like config updates               | `chore/update-eslint-config`     |
| `hotfix`   | Emergency fixes to production code              | `hotfix/fix-env-vars`            |
| `security` | Vulnerability patches or security upgrades      | `security/bump-fastapi-version`  |
| `test`     | Adding or updating tests                        | `test/add-auth-tests`            |

---

[⬆️ Back to Top](#-branch-naming-guidelines)

## 🔁 Optional: Include Issue Numbers

To associate a branch with a GitHub issue:

```text
feature/42-user-registration
bugfix/105-missing-validation
```

---

## 💡 Best Practices

- Use lowercase and hyphens (`-`) for readability
- Keep descriptions concise and clear
- Avoid long or vague names like `fix-stuff` or `new-branch`
- Keep each branch focused on one logical change or purpose

---

Following this convention makes it easier to review, track, and automate contributions across our projects. 🚀

[⬆️ Back to Top](#-branch-naming-guidelines)
