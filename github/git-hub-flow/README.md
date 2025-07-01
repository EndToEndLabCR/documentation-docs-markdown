# GitHub Flow Strategy

GitHub Flow is a simple and effective Git branching strategy designed for continuous integration and continuous deployment (CI/CD). It’s particularly well-suited for small teams and projects that require frequent updates and deployments.

This document outlines the GitHub Flow strategy for a team working on a microservices project with development, staging, and production environments. The strategy includes a single `main` branch for production-ready code and short-lived feature branches for development, with CI/CD integration and the use of Fork for collaboration.


## How it Works

### Main Branch
The `main` branch is always in a deployable state. It contains production-ready code and is the single source of truth for the project.

### Branching Model

- **Main**: Production-ready code.
- **Feature Branches**: Short-lived branches for new features or bug fixes. Created from `main` and merged back into `main` via pull requests.

### Workflow Steps

1. **Fork the Repository**: Each developer forks the main repository to their own GitHub account.
   ```bash
   git clone https://git.cglcloud.com/your-org/your-repo.git
   cd your-repo
   git remote add upstream https://git.cglcloud.com/your-org/your-repo.git
   ```

2. **Create a Feature Branch**: Branch off from `main` for new features or bug fixes.
   ```bash
   git checkout -b feature/awesome-feature main
   ```

3. **Develop and Commit**: Develop your feature or fix in the feature branch. Commit changes frequently with descriptive messages.
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

4. **Push to Fork**: Push your feature branch to your forked repository.
   ```bash
   git push origin feature/awesome-feature
   ```

5. **Open a Pull Request**: Open a pull request from your forked repository to the `main` branch of the main repository. Ensure code review and automated tests are completed before merging.

6. **Merge**: Once approved, merge the pull request into `main`. 
   ```bash
   git branch -d feature/awesome-feature
   ```

## Deployment Process

1. **Plan the Deployment to the Dev Environment**: A created PR into `main` will trigger the build process for the Docker images and will run a Terraform plan for the deployment to the dev environment.

2. **Deploy to the Dev Environment**: When a PR against `main` is merged, the resulting branch will be automatically deployed via Vela to the development environment.

3. **Deploy to Stage**: Ensure the currently deployed dev environment passes QA checks. When a new tag is created with the name `v*.*.*-rc.*`, it will trigger a deployment to the staging environment.

4. **Deploy to Prod**: When a new tag is created with the name `v*.*.*`, it will trigger a deployment to the production environment.

## Rollback Process

1. **Identify the Tag or Commit**: Determine the specific tag or commit you want to roll back to. Tags are often used for this purpose because they mark specific releases. Example: If you want to roll back to version `v1.0.0`, you would use the tag `v1.0.0`.

2. **Check Out the Tag or Commit**: Use the `git checkout` command to switch to the desired tag or commit.
   ```bash
   git checkout v1.0.0
   ```

3. **Deploy the Rolled-Back Version**: Deploy the code from the checked-out tag or commit to your production environment. This ensures that the previous stable version is now running in production.
   ```bash
   # Deploy the code to production
   ```

4. **Create a New Branch (Optional)**: If you need to make further changes or fixes based on the rolled-back version, create a new branch from the tag or commit.
   ```bash
   git checkout -b rollback-fix v1.0.0
   ```

5. **Merge Fixes Back to Main Branch**: After making necessary fixes, merge the changes back into the `main` branch and create a new release.
   ```bash
   git checkout main
   git merge rollback-fix
   git tag -a v1.0.1 -m "Hotfix after rollback"
   git push origin main --tags
   ```
