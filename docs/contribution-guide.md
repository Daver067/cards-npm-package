---
outline: deep
---

# Contribution Guide

This guide outlines the development workflow, commit standards, and code quality requirements for contributing to the project.

## Branches

### Main Branch

- Production environment
- Requires two reviewer approvals for PRs
- No direct pushes allowed
- All changes must pass CI/CD pipelines

### Develop Branch

- Staging environment
- Requires one reviewer approval for PRs
- Merges into main after QA testing
- All automated tests must pass

### Feature Branches

- Branch naming: `type/description`
- Types: feature/, bugfix/, hotfix/, release/
- Example: `feature/add-user-authentication`
- Branch from and merge back to develop

## Commits

The project uses conventional commit messages following this format:
`type(scope?): subject`

### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Regular maintenance
- `revert`: Reverting changes

### Examples

Good:

```
feat(auth): add JWT authentication
fix(navbar): resolve mobile overflow issue
docs(api): update endpoint documentation
```

Bad:

```
update stuff
fixed bug
WIP
```

### Git Hooks

The project uses pre-commit hooks to enforce standards:

1. Install dependencies: `npm install`
2. Hooks are automatically configured via husky

## Code Quality

### Prettier

- Runs automatically on staged files
- Configuration in `.prettierrc`
- To run manually: `npm run format`

### ESLint

- Enforces code quality rules
- Configuration in `.eslintrc`
- To run manually: `npm run lint`
- Common rules:
  - No unused variables
  - No console statements in production
  - Consistent import order

## Pull Requests

### Template

PRs must include:

- Description of changes
- Related issue numbers
- Testing completed
- Screenshots (if UI changes)

### Review Process

1. Open PR against develop
2. Pass automated checks
3. Get required approvals
4. Merge after resolution of feedback

### Testing Requirements

- Unit tests for new features
- Integration tests where applicable
- Manual QA before merging to main

## Troubleshooting

Common issues and solutions:

- Commit rejected: Run `npm run lint:fix`
- Hook installation: Remove and reinstall husky
- ESLint errors: Check `.eslintignore`
