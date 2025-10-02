# Frontend Project Template

A modern React + TypeScript web application template with a **Feature-Based Folder Structure** for scalable and maintainable development.  
This template is suitable for web apps with both public and internal/admin sections.

---

## 🚀 Project Overview

- **Public pages:** (e.g. Home, About, Contact, Projects)
- **Admin/Internal pages:** (e.g. Projects management, Users administration)
- **Tech stack:** React, Vite, TypeScript, Redux Toolkit, Ant Design (customize as needed)

---

## 📁 Project Structure

All code for a feature (UI components, hooks, API logic, state, types) is grouped together. Shared, reusable code lives in the `shared/` folder.

**Use kebab-case for all folder and file names** for consistency and cross-platform compatibility.

```plaintext
src/
  features/
    feature-name/
      components/
      hooks/
      api/
      state/
      types.ts
      index.ts
    another-feature/
      components/
      hooks/
      api/
      state/
      types.ts
      index.ts
    admin-projects/
      components/
      hooks/
      api/
      state/
      types.ts
      index.ts
  shared/
    components/
    hooks/
    utils/
    types/
  app/
    store.ts
    app.tsx
    routes.tsx
    protected-route.tsx
  assets/
  styles/
  main.tsx
  index.css
  vite-env.d.ts
```

### 📦 Features

- Each folder in `src/features/` represents a business domain or app section.
- Each feature contains its own `components/`, `hooks/`, `api/`, `state/`, `types.ts`, and `index.ts` as needed.
- For internal/admin features, use clear naming like `admin-projects/`.

### 🧩 Shared Code

- The `shared/` folder contains **only** code reused across multiple features:
  - `components/`: Common UI elements (buttons, modals, etc.)
  - `hooks/`: Utilities like `use-form`, `use-fetch`
  - `utils/`: Helper functions
  - `types/`: Shared/global TypeScript types

### ⚙️ App Setup

- The `app/` folder holds global setup, such as the Redux store, app-wide routes, and root components.

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm ci
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Lint and format

```bash
npm run lint
npm run format
```

---

## 🚦 Adding New Features

1. **Create a folder for the feature** under `src/features/` (e.g., `projects/`).
2. **Add subfolders as needed:** `components/`, `hooks/`, `api/`, `state/`, `types.ts`, `index.ts`.
3. **Implement all logic/UI for the feature inside this folder.**
4. **Export public API** for the feature in its `index.ts`.
5. **Update global store and routes** in `src/app/` if your feature needs them.
6. **Place only truly shared code in `shared/`.**
7. **Write tests** next to the code being tested or in a `__tests__/` subfolder.
8. **Use kebab-case** for all new folders and files.

---

## 🧑‍💻 Contribution Guidelines

- **Follow the project structure**: Feature code goes in its feature folder; shared code in `shared/`.
- **Use TypeScript** and write type-safe code.
- **Follow code style**: Run `npm run lint` and `npm run format` before submitting PRs.
- **Document your components and hooks** with JSDoc or comments.
- **Write tests** for new features and bug fixes.
- **Open a pull request** with a clear description of changes.
- **Use kebab-case** for all folder and file names.

---

## 🔒 Environment Variables

- Use `.env` for environment-specific values.
- Never commit secrets or sensitive data.

---

## 💬 Need Help?

- Check this `README.md` and the `docs/structure.md` for architectural decisions.
- Open an issue or discussion for architectural or codebase questions.

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/docs/react/introduce)
- [Feature-based folder structure](https://dev.to/hackmamba/a-feature-based-approach-to-structuring-react-projects-4j6o)

---
