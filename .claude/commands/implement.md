# /implement - Code Implementation Command

## Purpose
Used to write code, build features, and implement designs.

## When to Use
- Writing React components
- Building backend APIs
- Creating database migrations
- Implementing features from plan
- Fixing bugs with code changes
- Refactoring code

## What Agents to Invoke
- **Frontend Engineer** - React components, UI logic
- **Backend Engineer** - APIs, business logic
- **Database Architect** - Schema changes, queries
- **Prompt Engineer** - AI prompt templates (if needed)

## Input Required
- Clear specification (from plan or issue)
- Context/background
- Success criteria
- Any constraints/limitations

## Output Expected
- Clean, well-documented code
- Tests (unit + integration)
- API documentation (if backend)
- Component props documentation (if frontend)
- Migration scripts (if database)

## Example Usage

```
/implement "Scene Editor - Content Tab"
Based on plan document, implement:
- SceneEditorForm component with narration field
- Dialogue list management
- Location selector integration
- Full form validation
- Save/cancel buttons
- Error handling

Reference: docs/ARCHITECTURE.md Section 7 (UI Layout)
Reference: docs/CODING_STANDARDS.md
```

## Typical Flow
1. **Plan** feature
2. **Implement** from plan
3. **Review** code quality
4. **Test** functionality
5. Deploy/merge

## Definition of Done
✅ Code written & tested
✅ Tests passing (100%)
✅ Code style compliant
✅ No console errors
✅ Documentation complete
✅ Ready for review

## Success Criteria
✅ Feature works as designed
✅ Code is clean & readable
✅ Tests cover happy path + edge cases
✅ Performance acceptable
✅ No breaking changes
✅ Follows coding standards

## Notes
- Code first, optimize later
- Write tests alongside code
- Reference plan throughout
- Ask for clarification if unclear
- Update documentation as you go
- Commit frequently with clear messages
