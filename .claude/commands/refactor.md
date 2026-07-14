# /refactor - Code Refactoring Command

## Purpose
Used for improving existing code without changing functionality. Focus on quality, maintainability, and performance.

## When to Use
- Code is working but messy
- Duplicate code needs consolidation
- Performance can be improved
- Adding new similar feature (refactor first)
- Technical debt paydown
- Improving test coverage

## What Agents to Invoke
- **Code Reviewer** - Code quality issues
- **Frontend Engineer** - Component refactoring
- **Backend Engineer** - API/logic refactoring
- **Database Architect** - Query optimization
- **QA Reviewer** - Regression testing

## Input Required
- Code to refactor
- Motivation/goal (why refactor)
- Constraints (can't break this, etc.)
- Success criteria

## Output Expected
- Refactored code
- Same functionality, better quality
- Updated tests
- Performance improvements (if applicable)
- Documentation updates (if needed)

## Example Usage

```
/refactor "Consolidate Scene Selector Components"
Currently have:
- CharacterSelector.jsx (150 lines)
- LocationSelector.jsx (145 lines)
- MusicSelector.jsx (140 lines)
- CameraSelector.jsx (135 lines)

Goal:
- Extract common pattern to GenericSelector component
- Reduce duplication
- Make future selectors easier
- Maintain 100% same functionality

Constraints:
- No changes to component interfaces
- Tests must still pass
- No performance regression
```

## Refactoring Types

### Code Consolidation
**Before**:
```javascript
// 3 nearly identical selector components
const CharacterSelector = ({ value, onChange }) => { ... };
const LocationSelector = ({ value, onChange }) => { ... };
const MusicSelector = ({ value, onChange }) => { ... };
```

**After**:
```javascript
// 1 generic component
const LibrarySelector = ({ library, value, onChange, placeholder }) => { ... };
// Use: <LibrarySelector library="characters" ... />
```

### Performance Optimization
**Before**:
```javascript
// Re-render on every parent render
<SceneCard scene={scene} />
```

**After**:
```javascript
// Only re-render when scene changes
const SceneCard = React.memo(({ scene }) => { ... });
```

### Logic Extraction
**Before**:
```javascript
// Business logic mixed with UI
const SceneEditor = () => {
  const validateAndSave = async () => {
    const words = narration.split(/\s+/).length;
    if (words > 200) throw new Error('Too long');
    const response = await fetch('/api/scenes', { ... });
    // ...
  };
};
```

**After**:
```javascript
// Hook for business logic
const useSceneValidation = () => {
  const validateNarration = (text) => {
    const words = text.split(/\s+/).length;
    if (words > 200) throw new Error('Too long');
  };
  const saveScene = async (data) => { ... };
  return { validateNarration, saveScene };
};

// Component uses hook
const SceneEditor = () => {
  const { validateNarration, saveScene } = useSceneValidation();
};
```

### Query Optimization
**Before**:
```javascript
// N+1 query problem
const scripts = await Script.find();
for (const script of scripts) {
  script.scenes = await Scene.find({ scriptId: script._id });
}
```

**After**:
```javascript
// Aggregation pipeline
const scripts = await Script.aggregate([
  { $lookup: { from: 'scenes', localField: '_id', foreignField: 'scriptId', as: 'scenes' } }
]);
```

## Refactoring Process

1. **Understand Current Code**
   - What does it do?
   - Why is it designed this way?
   - What are the pain points?

2. **Plan Refactoring**
   - What will improve?
   - What won't change?
   - What are the risks?

3. **Write Tests First**
   - Ensure current behavior is tested
   - Green bar before starting

4. **Refactor Incrementally**
   - Small, safe changes
   - Keep tests green
   - Commit frequently

5. **Verify No Regressions**
   - All tests pass
   - Same behavior
   - Better performance (if applicable)

6. **Code Review**
   - Review refactored code
   - Verify improvement
   - Check for new issues

## Refactoring Guidelines

✅ **DO**:
- Keep functionality identical
- Keep tests green throughout
- Make small, reviewable changes
- Document improvements
- Measure performance (if optimizing)
- Commit frequently

❌ **DON'T**:
- Change behavior
- Mix refactoring with features
- Skip tests
- "While I'm at it" changes
- Ignore warnings/errors
- Refactor untested code

## Common Refactoring Patterns

### Extract Method
Take repeated logic and put in reusable function

### Extract Component
Take UI patterns and put in reusable component

### Extract Hook
Take stateful logic and put in custom hook

### Extract Constant
Replace magic numbers/strings with named constants

### Extract Variable
Break complex expression into named intermediate values

### Consolidate Duplicate Code
Find duplicates and unify

### Remove Dead Code
Delete unused code, variables, imports

## Success Criteria

✅ Functionality unchanged
✅ All tests passing
✅ Code more maintainable
✅ Performance same or better
✅ Code review approved
✅ Team agrees on improvement

## Typical Flow
1. **Identify** refactoring opportunity
2. **Test** current code thoroughly
3. **Refactor** incrementally
4. **Test** each step
5. **Review** refactored code
6. **Deploy** with confidence

## Measurement

Track improvements:
- Lines of code (should decrease)
- Cyclomatic complexity (should decrease)
- Test coverage (should stay same)
- Performance metrics (should improve or stay same)
- Time to make similar changes (should decrease)

## When NOT to Refactor
- During active feature development
- Untested code (test first)
- Production outage (fix bug first)
- Right before release
- If unclear on design (get alignment first)

## Documentation
- Comment on PR: why this refactoring
- Update related docs if interfaces change
- Add before/after metrics
- Document lessons learned
