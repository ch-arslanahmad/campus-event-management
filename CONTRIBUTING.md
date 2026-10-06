# Contributing

How we work on this project, from creating an Issue to merging a Pull Request.

## Development Workflow

### 1. Issues

Every piece of work starts with a GitHub Issue.

1. Go to the **Issues** tab → **New Issue**
2. Fill in:
   - **Title** - short summary (e.g., "Add login form validation")
   - **Description** - what needs doing, why, and any relevant details
3. Add **labels** (bug, feature, enhancement, etc.)
4. **Assign** the issue to the person doing the work

### 2. Branches

Once assigned, the developer creates a branch for that issue:

```
git checkout -b feature/login
```

Branch naming convention:

- `feature/<short-description>` - new features
- `bugfix/<short-description>` - bug fixes
- `hotfix/<short-description>` - urgent fixes

Branch name should relate to the issue it belongs to.

### 3. Pull Requests

When the work is done, open a Pull Request:

1. Push your branch to GitHub
2. Open a PR from your branch → `main`
3. In the PR description, **link the issue**:

> [!note]
> A PR can exist without an issue, however it's not recommended.

```
Closes #3
```

(where `3` is the issue number)

4. Request a review from the team lead

### 4. Issue → PR Workflow

```
Issue created
  → Dev assigns to [self/team-member]
  → Creates branch
  → Does the work
  → Opens PR with "Closes #issue"
  → Team lead reviews
  → Merge
  → Issue closes automatically
```

When the PR merges, GitHub automatically closes the linked issue.

### 5. Example

```
Issue #3 (Add login form)
  → feature/login branch created
  → Code written and committed
  → PR #7 opened with "Closes #3"
  → Review approved
  → PR #7 merged into main
  → Issue #3 closed automatically
```

## Best Practices

- One issue = one branch = one PR. Keep them small and focused.
- Always link the PR to its issue with `Closes #<number>`.
- Write meaningful commit messages (use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, etc.).
- Never push directly to `main`; always go through a PR.
- Pull the latest `main` into your branch regularly to avoid conflicts.
- Don't commit secrets, API keys, or credentials.
