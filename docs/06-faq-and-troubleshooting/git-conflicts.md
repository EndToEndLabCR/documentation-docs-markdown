# Git Conflicts

This file provides comprehensive guidance on understanding, preventing, and resolving Git merge conflicts.

## Understanding Git Conflicts

### What are Git Conflicts?
Git conflicts occur when Git cannot automatically merge changes from different branches or commits. This happens when:
- The same line in a file has been modified differently in two branches
- One branch deletes a file that another branch modifies
- Binary files are modified in both branches

### Types of Conflicts

#### Content Conflicts
```bash
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

#### Rename/Delete Conflicts
```bash
CONFLICT (modify/delete): file.txt deleted in branch-a and modified in HEAD.
```

#### Add/Add Conflicts
```bash
CONFLICT (add/add): Merge conflict in file.txt
```

## Identifying Conflicts

### Check Status
```bash
# See which files have conflicts
git status

# Output will show:
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   src/main.js
#         deleted by us:   old-file.txt
#         added by them:   new-file.txt
```

### View Conflict Markers
When Git encounters a conflict, it marks the conflicting sections in the file:
```
<<<<<<< HEAD (Current Change)
const message = "Hello from main branch";
=======
const message = "Hello from feature branch";
>>>>>>> feature-branch (Incoming Change)
```

## Preventing Conflicts

### Best Practices

#### Keep Branches Short-Lived
```bash
# Create feature branch
git checkout -b feature/quick-fix
# Make changes and merge quickly
git checkout main
git merge feature/quick-fix
git branch -d feature/quick-fix
```

#### Regular Synchronization
```bash
# Frequently pull from main
git checkout main
git pull origin main

# Rebase feature branch regularly
git checkout feature-branch
git rebase main
```

#### Coordinate Team Changes
- Communicate about files being modified
- Use separate files/modules when possible
- Plan refactoring activities together
- Use feature flags for large changes

#### Use .gitattributes for Binary Files
```bash
# .gitattributes
*.png binary
*.jpg binary
*.pdf binary
*.docx binary
```

## Resolving Conflicts

### Manual Resolution

#### Step 1: Identify Conflicted Files
```bash
git status
# or
git diff --name-only --diff-filter=U
```

#### Step 2: Open and Edit Files
```javascript
// Before resolution
function greet() {
<<<<<<< HEAD
    return "Hello from main!";
=======
    return "Hello from feature!";
>>>>>>> feature-branch
}

// After resolution
function greet() {
    return "Hello from merged version!";
}
```

#### Step 3: Mark as Resolved
```bash
# Add the resolved file
git add src/main.js

# Check status
git status
```

#### Step 4: Complete the Merge
```bash
# Commit the merge
git commit -m "Resolve merge conflicts in src/main.js"

# Or continue rebase
git rebase --continue
```

### Using Merge Tools

#### Configure Merge Tool
```bash
# Set up VS Code as merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Set up Beyond Compare
git config --global merge.tool bc3
git config --global mergetool.bc3.path "C:/Program Files/Beyond Compare 4/bcomp.exe"

# Set up P4Merge
git config --global merge.tool p4merge
git config --global mergetool.p4merge.path "/Applications/p4merge.app/Contents/MacOS/p4merge"
```

#### Use Merge Tool
```bash
# Launch merge tool for conflicts
git mergetool

# This will open your configured tool with three panels:
# - LOCAL (your changes)
# - BASE (common ancestor)  
# - REMOTE (their changes)
# - MERGED (result)
```

### IDE Integration

#### VS Code
1. Install GitLens extension
2. Open conflicted file
3. Use "Accept Current Change", "Accept Incoming Change", or "Accept Both Changes"
4. Edit manually if needed
5. Save file and stage changes

#### IntelliJ IDEA
1. Go to VCS → Git → Resolve Conflicts
2. Select conflicted files
3. Use the merge dialog with three panels
4. Choose changes to accept or edit manually
5. Click "Apply" to resolve

## Advanced Conflict Resolution

### Interactive Rebase
```bash
# Start interactive rebase
git rebase -i HEAD~3

# In the editor, choose actions:
pick abc123 First commit
edit def456 Second commit (has conflicts)
pick ghi789 Third commit

# When conflicts occur during rebase:
# 1. Resolve conflicts
# 2. git add resolved-files
# 3. git rebase --continue
```

### Cherry-pick Conflicts
```bash
# Cherry-pick commit with conflicts
git cherry-pick abc123

# Resolve conflicts
git add .
git cherry-pick --continue

# Or abort cherry-pick
git cherry-pick --abort
```

### Merge vs Rebase Conflicts

#### Merge Strategy
```bash
git checkout feature-branch
git merge main

# Conflicts appear, resolve them
git add .
git commit -m "Merge main into feature-branch"
```

#### Rebase Strategy
```bash
git checkout feature-branch
git rebase main

# Conflicts appear for each commit
# Resolve conflicts for first commit
git add .
git rebase --continue

# Repeat for each conflicted commit
```

## Conflict Resolution Strategies

### Taking One Side Completely
```bash
# Take your version (current branch)
git checkout --ours conflicted-file.txt

# Take their version (incoming branch)
git checkout --theirs conflicted-file.txt

# For entire merge, prefer one side
git merge -X ours feature-branch
git merge -X theirs feature-branch
```

### Partial Resolution
```javascript
// Original conflict
function calculateTotal(items) {
<<<<<<< HEAD
    return items.reduce((sum, item) => sum + item.price, 0);
=======
    return items.reduce((sum, item) => sum + item.cost, 0);
>>>>>>> feature-branch
}

// Resolution combining both approaches
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price || item.cost), 0);
}
```

### Complex Conflicts
For files with multiple conflict sections:
```bash
# Show all conflicts in file
git diff conflicted-file.txt

# Use pattern to find conflicts
grep -n "<<<<<<< HEAD" src/**/*.js
```

## Aborting and Resetting

### Abort Operations
```bash
# Abort merge
git merge --abort

# Abort rebase
git rebase --abort

# Abort cherry-pick
git cherry-pick --abort

# Reset to before merge attempt
git reset --hard HEAD~1
```

### Emergency Reset
```bash
# Find the commit hash before the problematic merge
git reflog

# Reset to that commit
git reset --hard abc123

# Force push if already pushed (DANGEROUS)
git push --force-with-lease origin branch-name
```

## Binary File Conflicts

### Understanding Binary Conflicts
```bash
# Git cannot merge binary files automatically
warning: Cannot merge binary files: image.png (HEAD vs. feature-branch)
```

### Resolving Binary Conflicts
```bash
# Choose version from current branch
git checkout --ours image.png

# Choose version from incoming branch  
git checkout --theirs image.png

# Add resolved file
git add image.png
```

### Preventing Binary Conflicts
- Use version control for source files, not generated files
- Store binary assets in separate repositories
- Use Git LFS for large binary files
- Coordinate binary file changes in team

## Team Workflows

### Conflict Resolution in Pull Requests

#### GitHub Workflow
1. Create pull request
2. If conflicts exist, GitHub will show "This branch has conflicts"
3. Options:
   - Resolve conflicts in GitHub web interface
   - Resolve locally and push

#### Local Resolution for PR
```bash
# Sync with target branch
git checkout main
git pull origin main

# Switch to feature branch
git checkout feature-branch

# Rebase or merge to resolve conflicts
git rebase main
# or
git merge main

# Push resolved changes
git push origin feature-branch
```

### Code Review with Conflicts
- Resolve conflicts before requesting review
- Document complex resolution decisions
- Consider splitting large conflicted changes
- Use pair programming for complex merges

## Automated Conflict Resolution

### Git Rerere
```bash
# Enable rerere (reuse recorded resolution)
git config --global rerere.enabled true

# Git will remember how you resolved similar conflicts
# and automatically apply the same resolution
```

### Custom Merge Drivers
```bash
# .gitattributes
*.generated merge=ours

# .git/config
[merge "ours"]
    driver = true
```

## Troubleshooting

### Common Issues

#### "Already up to date" but conflicts exist
```bash
# Check if you're on the right branch
git branch

# Verify remote is up to date
git fetch origin

# Check for uncommitted changes
git status
```

#### Conflicts keep reappearing
```bash
# Check if rerere is causing issues
git config --get rerere.enabled

# Clear rerere cache
rm -rf .git/rr-cache

# Check for automatic merge/rebase tools
git config --get-regexp merge
```

#### Lost changes during conflict resolution
```bash
# Check reflog for lost commits
git reflog

# Recover lost changes
git checkout abc123

# Create new branch from recovered commit
git checkout -b recovery-branch abc123
```

### Best Practices Summary

1. **Prevention**
   - Keep branches small and short-lived
   - Regular synchronization with main branch
   - Good communication within team
   - Use appropriate .gitattributes

2. **Resolution**
   - Understand the conflict before resolving
   - Test the resolution thoroughly
   - Document complex resolution decisions
   - Use appropriate tools (merge tools, IDE integration)

3. **Team Process**
   - Resolve conflicts before code review
   - Coordinate on large refactoring efforts
   - Use consistent merge strategies
   - Train team members on conflict resolution

### Emergency Contacts
- For critical production merges: Contact senior developer or team lead
- For complex architectural conflicts: Involve system architect
- For data-related conflicts: Involve database administrator

Remember: When in doubt, ask for help rather than risk introducing bugs through incorrect conflict resolution!