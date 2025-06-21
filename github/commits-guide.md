# ✅ Guidelines for Writing Great Commit Messages

Writing clear and meaningful commit messages helps your team understand the history of changes and improves collaboration.

---

## 1. Use the Conventional Commit Format (Optional but Recommended)

```bash
<type>(optional scope): <short summary>
```

## Example

```bash
feat(auth): add JWT-based login
fix(ui): correct button alignment on mobile
```

**Common types**:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting, missing semi colons, etc.
- `ref`: code change that neither fixes a bug nor adds a feature
- `test`: adding or fixing tests
- `chore`: maintenance tasks

---

## 2. Write Clear and Concise Messages

- Use the **imperative mood**: “Add feature” not “Added” or “Adds”.
- Keep the **summary under 50 characters**.
- Use the **body** (optional) to explain _why_ the change was made, not just _what_.

---

## 3. Reference Issues or PRs

Link related issues or pull requests to provide context.

```bash
fix(auth): handle token expiration

Fixes #123
```

---

## 4. Examples

```bash
feat(api): add endpoint for user registration

This adds a new POST endpoint at /api/register to allow users to sign up.
Includes validation and error handling.

Closes #42
```

```bash
docs(readme): update installation instructions
```

```bash
chore(deps): update dependency eslint to v8.10.0
chore: update dependencies
chore: add codeowners file
chore: update CI workflow to use Node.js 18
chore: clean up unused scripts
chore: reformat code with prettier
```

This type of commit is used for routine tasks such as updating dependencies, configuration files, or build scripts that do not affect the application's functionality.

---

## 💡 Tips

- Use a linter like Commitlint to enforce commit message format.
- Squash commits before merging to keep history clean.
