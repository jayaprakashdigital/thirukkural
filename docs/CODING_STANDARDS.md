# Coding Standards - Thirukkural Script Module

## JavaScript/React Standards

### Naming Conventions
- **Components**: PascalCase (`SceneEditor.jsx`)
- **Functions/variables**: camelCase (`handleSave`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_DURATION = 120`)
- **Files**: kebab-case (`scene-editor.jsx`) or PascalCase for components
- **Avoid**: single-letter variables except in loops (`for (let i = 0; ...)`)

### Component Structure
```javascript
// 1. Imports
import React from 'react';
import styles from './SceneEditor.module.css';

// 2. Constants & types
const MIN_DURATION = 15;
const MAX_DURATION = 120;

// 3. Component definition
export const SceneEditor = ({ scene, onSave }) => {
  // 4. Hooks (useState, useEffect, custom)
  const [narration, setNarration] = React.useState('');
  
  // 5. Event handlers
  const handleSave = () => { /* ... */ };
  
  // 6. Render
  return (
    <div className={styles.editor}>
      {/* JSX */}
    </div>
  );
};

// 7. PropTypes or export type
SceneEditor.propTypes = {
  scene: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};
```

### Formatting
- Indentation: 2 spaces
- Line length: < 100 characters (where reasonable)
- No trailing whitespace
- Semicolons: Always
- Quotes: Double quotes for JSX, single for strings

### Comments
- Explain WHY, not WHAT
- Keep comments updated with code
- Remove commented code (use git history)
- Avoid redundant comments

```javascript
// GOOD: Explains why
// Cache for 1 hour to prevent excessive API calls
await redis.setex(`script:${id}`, 3600, JSON.stringify(script));

// BAD: Obvious from code
// Set redis key
redis.setex(...);
```

## React Best Practices

### Hooks
- `useState` for component state
- `useEffect` for side effects (with dependencies!)
- `useCallback` for event handlers passed to children
- `useMemo` for expensive computations
- Custom hooks for reusable logic

### Performance
- Wrap expensive components with `React.memo`
- Use `useCallback` for deps in useEffect
- Avoid inline functions as event handlers
- Use virtual scrolling for large lists
- Lazy load images/heavy components

### Accessibility
- Semantic HTML (`<button>`, `<form>`, not `<div>`)
- ARIA labels for icon buttons
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Color contrast ≥ 4.5:1

## Database Standards

### Queries
- Always use parameterized queries (prevent SQL injection)
- Use indexes on frequently queried fields
- Avoid N+1 queries (use JOINs or aggregation)
- Limit result sets (pagination)
- Add EXPLAIN ANALYZE for optimization

### Schema
- Use consistent naming: `snake_case` for tables/columns
- Foreign keys for relationships
- Constraints for data validation
- Default values where appropriate
- Audit columns (created_at, updated_at, created_by)

## Error Handling

### Frontend
```javascript
// Try/catch for async operations
try {
  const data = await fetchScenes();
  setScenes(data);
} catch (error) {
  logger.error('Failed to fetch scenes:', error);
  showErrorToast('Failed to load scenes. Please try again.');
  setScenes([]); // Fallback to empty
}
```

### Backend
```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: { code: err.code, message: err.message }
  });
});
```

## Testing

### Unit Tests (Jest)
- Test behavior, not implementation
- File: `ComponentName.test.js` next to component
- Coverage: > 80% for critical paths
- Use descriptive test names

### Integration Tests (React Testing Library)
- Test user interactions
- Find elements by accessible names/roles
- Test form submission
- Test API integration

### E2E Tests (Playwright)
- Test full workflows
- Navigate app like a user
- Verify results

## Version Control (Git)

### Commits
- Atomic commits (one feature/fix per commit)
- Clear messages: `"Add scene editor component"` (not `"fix"`)
- Reference issues: `"Fix #123: Scene not saving"`
- Sign-off: `Co-Authored-By: Name <email>`

### Branches
- Feature: `feature/scene-editor`
- Bugfix: `bugfix/save-not-working`
- Main: `master` (production)
- Dev: `develop` (pre-production)

### Pull Requests
- Descriptive title
- Summary of changes
- Link to related issues
- Screenshots for UI changes
- Self-review before requesting review

## Code Review

### What to look for
- ✅ Correctness (no bugs)
- ✅ Readability (clear, maintainable)
- ✅ Performance (no obvious issues)
- ✅ Security (no vulnerabilities)
- ✅ Tests (adequate coverage)
- ✅ Standards (follows conventions)

### How to comment
- Specific & actionable
- Explain WHY
- Suggest improvements
- Respectful tone

## API Standards

### Design
- RESTful endpoints
- HTTP methods: GET, POST, PUT, DELETE
- Status codes: 200, 201, 400, 404, 500
- Consistent response format

### Response Format
```javascript
{
  "success": true,
  "data": { /* actual data */ },
  "meta": { "count": 10, "page": 1 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field required: narration"
  }
}
```

## Documentation

### Code
- JSDoc for functions/components
- Type definitions (PropTypes or TypeScript)
- README for complex modules

### API
- Document endpoints
- Request/response examples
- Error codes
- Authentication requirements

### General
- Architecture diagrams
- Setup instructions
- Deployment steps
- Troubleshooting guide

## Tools & Setup

### Linting
- ESLint (code quality)
- Prettier (formatting)
- Pre-commit hooks

### Testing
- Jest (unit)
- React Testing Library (integration)
- Playwright (E2E)

### Bundling
- Webpack or Vite
- Code splitting
- Asset optimization

## Checklists

### Before Commit
- [ ] Code follows standards
- [ ] Tests passing
- [ ] No console errors/warnings
- [ ] Committed only relevant files
- [ ] Clear commit message

### Before PR
- [ ] Self-reviewed code
- [ ] Tests added
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance acceptable

### Before Merge
- [ ] Code review approved
- [ ] All tests passing
- [ ] No conflicts
- [ ] Squashed if many commits
- [ ] Merged by maintainer
