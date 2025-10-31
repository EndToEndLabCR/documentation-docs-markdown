# Deployment Guide for Docusaurus to GitHub Pages

## Overview
This document explains the configuration changes made to deploy your Docusaurus site to GitHub Pages and provides instructions for the first deployment.

## Changes Made

### 1. **docusaurus.config.ts** - GitHub Pages Configuration
Updated the Docusaurus configuration file to correctly point to your GitHub Pages URL:

```typescript
url: "https://endtoendlabcr.github.io",
baseUrl: "/documentation-docs-markdown/",
```

**Why these changes?**
- `url`: This is the base URL where your site will be hosted (GitHub Pages URL for your organization)
- `baseUrl`: GitHub Pages serves project sites under a subpath matching the repository name
- `organizationName` and `projectName`: Already correctly set to match your repository

### 2. **GitHub Actions Workflow** (.github/workflows/deploy.yml)
Enhanced the deployment workflow with the following improvements:

#### Updated Node.js Version
```yaml
node-version: '20'  # Changed from 18 to 20
```
**Why?** Your `package.json` specifies `"node": ">=20.0"`, so the workflow must use Node.js 20+.

#### Changed to npm ci
```yaml
run: npm ci  # Changed from npm install
```
**Why?** `npm ci` provides:
- Faster, more reliable builds
- Consistent installations (uses package-lock.json exactly)
- Automatic cleanup before install
- Better for CI/CD environments

#### Added NPM Caching
```yaml
cache: 'npm'  # Added caching
```
**Why?** Dramatically speeds up builds by caching node_modules between runs.

#### Updated Action Versions
```yaml
uses: actions/checkout@v4      # Updated from v3
uses: actions/setup-node@v4    # Updated from v3
uses: peaceiris/actions-gh-pages@v4  # Updated from v3
```
**Why?** Latest versions include security updates, bug fixes, and performance improvements.

#### Added Manual Triggering
```yaml
workflow_dispatch:  # Allows manual workflow runs
```
**Why?** You can now manually trigger deployments from the GitHub Actions tab without pushing to main.

#### Added Git User Configuration
```yaml
user_name: 'github-actions[bot]'
user_email: 'github-actions[bot]@users.noreply.github.com'
```
**Why?** Ensures commits to the gh-pages branch are properly attributed to the GitHub Actions bot.

#### Added Explicit Permissions
```yaml
permissions:
  contents: write  # Required for pushing to gh-pages
```
**Why?** Explicitly grants the workflow permission to push to the gh-pages branch.

### 3. **README.md** - Build Status Badge
Added a GitHub Actions status badge at the top of the README:

```markdown
[![Deploy Docusaurus Site](https://github.com/EndToEndLabCR/documentation-docs-markdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/EndToEndLabCR/documentation-docs-markdown/actions/workflows/deploy.yml)
```

**Why?** Provides quick visibility into the build/deployment status of your site.

## First-Time Deployment Instructions

### Prerequisites
- Ensure you have push access to the repository
- GitHub Pages must be enabled for your repository

### Steps for First Deployment

#### Option 1: Automatic Deployment (Recommended)
The workflow will automatically run when you merge this PR or push to the `main` branch:

```bash
# Merge this PR or push to main
git checkout main
git merge copilot/configure-docusaurus-deployment
git push origin main
```

The GitHub Actions workflow will:
1. Automatically detect the push to main
2. Install dependencies
3. Build your Docusaurus site
4. Create/update the `gh-pages` branch
5. Deploy the built site to GitHub Pages

#### Option 2: Manual Deployment
You can also manually trigger the deployment from GitHub:

1. Go to the **Actions** tab in your repository
2. Click on **Deploy Docusaurus Site** workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

### Enable GitHub Pages (One-Time Setup)

After the first successful deployment, configure GitHub Pages in your repository:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Within a few minutes, your site will be live at:
**https://endtoendlabcr.github.io/documentation-docs-markdown/**

## Monitoring Deployments

### Check Build Status
- View workflow runs in the **Actions** tab
- The badge in README.md shows current status
- Click the badge to see detailed build logs

### Troubleshooting Failed Deployments

If a deployment fails:

1. **Check the Actions tab** for error logs
2. **Common issues:**
   - Build errors: Check the "Build the site" step logs
   - Broken links: Docusaurus throws errors on broken internal links
   - Missing dependencies: Ensure package-lock.json is committed

3. **Re-run failed jobs:**
   - Go to the failed workflow run
   - Click "Re-run failed jobs"

## Workflow Behavior

### When Does It Run?
- **Automatically:** On every push to the `main` branch
- **Manually:** Via the Actions tab using "Run workflow"

### What It Does
1. Checks out your code
2. Sets up Node.js 20 with npm caching
3. Installs dependencies with `npm ci`
4. Builds the site with `npm run build`
5. Deploys the `./build` directory to the `gh-pages` branch
6. GitHub Pages serves the site from the `gh-pages` branch

### Deployment Time
- First deployment: ~2-3 minutes (no cache)
- Subsequent deployments: ~1-2 minutes (with cache)
- GitHub Pages propagation: ~1-2 minutes after deployment

## Local Testing

Before pushing changes, test your site locally:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build the site (tests for build errors)
npm run build

# Serve the built site locally
npm run serve
```

The development server runs at `http://localhost:3000` and includes hot-reloading.

## Git Commands Summary

```bash
# Clone the repository (if not already done)
git clone https://github.com/EndToEndLabCR/documentation-docs-markdown.git
cd documentation-docs-markdown

# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge the configuration changes (if from a PR)
git merge copilot/configure-docusaurus-deployment

# Push to trigger deployment
git push origin main

# The workflow runs automatically - monitor in Actions tab
```

## Additional Notes

### Using the `deploy` Script
The `npm run deploy` command in package.json runs `docusaurus deploy`, which can deploy directly from your local machine. However, using GitHub Actions is recommended because:
- Automated deployments on every push
- No need to set up SSH keys or personal access tokens locally
- Consistent build environment
- Build logs and history in GitHub

### Updating Content
To update your documentation:

1. Edit files in the `docs/` folder
2. Commit and push to `main`
3. GitHub Actions automatically rebuilds and deploys
4. Changes appear on GitHub Pages within 2-3 minutes

### Custom Domains
To use a custom domain:

1. Add a `CNAME` file to the `static/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update `url` in `docusaurus.config.ts` to your custom domain

## Support

For issues with:
- **Docusaurus:** https://docusaurus.io/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **GitHub Pages:** https://docs.github.com/en/pages

---

**Your site will be available at:** https://endtoendlabcr.github.io/documentation-docs-markdown/
