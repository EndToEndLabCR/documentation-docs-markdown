# Repository Naming Guidelines

To maintain consistency, clarity, and scalability across all projects in the organization, we follow a structured naming convention for repositories.

---

## 🧱 Project Structure

Our repositories are named using the following pattern:

```bash
<projectname>-<type>-<technology>
```

---

## 🔹 Components Explained

| Segment       | Description                               | Examples                                                       |
| ------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `projectname` | The project identifier (short, lowercase) | `workshop1`, `demoapp`, `sandbox`                              |
| `type`        | Purpose of the repository                 | `web`, `api`, `mobile`, `desktop`, `infra`, `tool`, `template` |
| `technology`  | Primary tech or stack used                | `react`, `fastapi`, `flutter`, `electron`, `terraform`, `vite` |

---

[⬆️ Back to Top](#repository-naming-guidelines)

## ✅ Accepted `type` Values

| Type      | Use Case                             |
| --------- | ------------------------------------ |
| `web`     | Web frontend apps                    |
| `api`     | Backend APIs and services            |
| `mobile`  | Native or hybrid mobile apps         |
| `desktop` | Desktop clients (e.g. Electron apps) |
| `infra`   | Infrastructure, CI/CD, automation    |
| `tool`    | Scripts, utilities, internal tools   |

---

## 📦 Repo Name Examples

### 🚀 Demo Application

| Repository Name       | Description                |
| --------------------- | -------------------------- |
| `demoapp-web-react`   | React web frontend         |
| `demoapp-api-fastapi` | Backend service in FastAPI |

---

### 🧰 Internal Tools & Templates

| Repository Name        | Description                    |
| ---------------------- | ------------------------------ |
| `template-api-fastapi` | API starter template           |
| `template-web-react`   | Vite + React frontend template |

---

> 🧩 This convention helps our team and community contributors instantly understand what each repo is for, what tech it uses, and which project it belongs to.

For any questions or additions to the convention, open an issue in the `.github` repository.

[⬆️ Back to Top](#repository-naming-guidelines)
