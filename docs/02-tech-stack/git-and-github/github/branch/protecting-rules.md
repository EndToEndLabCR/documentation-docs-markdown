# 🔐 Branch Protection Rules

Follow these steps to protect important branches like `main` or `production`:

---

## ✅ Steps

1. **Go to Your Repository**

   - Navigate to your repository on GitHub.

2. **Open Settings**

   - Click on the **"Settings"** tab (requires admin access).

3. **Select "Branches"**

   - In the left sidebar, click **"Branches"** under the "Code and automation" section.

4. **Add a Branch Protection Rule**

   - Click the **"Add branch ruleset"** button.

5. **Configure the Rule**

   - **Branch name pattern**: Enter the branch name (e.g., `main`,`develop`, `release/*`).
   - Enable the desired options:
     - ✅ Restrict deletions
     - ✅ Require a pull request before merging
       - Required approvals: at least 1
       - Require approval of the most recent reviewable push
       - Require conversation resolution before merging
     - ✅ Require status checks to pass
       - Require branches to be up to date before merging

6. **Save Changes**
   - Click **"Create"** or **"Save changes"** at the bottom.

[⬆️ Back to Top](#-branch-protection-rules)

---

## 🔒 Recommended Settings for `main` or `production`

| Setting                         | Description                                   |
| ------------------------------- | --------------------------------------------- |
| ✅ Require pull request reviews | Enforces code review before merging           |
| ✅ Require status checks        | Ensures CI/CD checks pass before merging      |
| ✅ Require linear history       | Keeps commit history clean (no merge commits) |
| ✅ Include administrators       | Applies rules to admins as well               |
| ✅ Block force pushes           | Limits who can push directly to the branch    |

---

Main branch ruleset example:  
![image](https://github.com/user-attachments/assets/3b92bd5b-347e-4e02-b64b-fbb530b803a2)
![image](https://github.com/user-attachments/assets/9aa0d2f4-bb8b-481a-8094-daed7c6d864c)
![image](https://github.com/user-attachments/assets/c614aaa2-3501-44a3-800f-2e74621773a4)

## 💡 Tips

- Use wildcards like `release/*` to apply rules to multiple branches.
- Combine with GitHub Actions for automated checks and workflows.
- Regularly review and update rules as your team grows.

[⬆️ Back to Top](#-branch-protection-rules)
