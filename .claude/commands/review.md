# /review - Code Review Command

## Purpose
Used for reviewing code quality, architecture compliance, and best practices before merging.

## When to Use
- After code is implemented
- Before submitting PR
- Reviewing colleague's code
- Final quality check
- Architecture compliance verification

## What Agents to Invoke
- **Code Reviewer** - Code quality, patterns
- **QA Reviewer** - Testing adequacy
- **Animation Director** - Creative/artistic aspects (if applicable)
- **Prompt Engineer** - AI prompt quality (if applicable)

## Input Required
- Code/PR to review
- Context (what it does, why)
- Acceptance criteria
- Special concerns/areas to focus on

## Output Expected
- Detailed review comments
- Issues categorized (critical, high, medium, low)
- Approval or revision request
- Specific suggestions
- Pattern recommendations
- Performance metrics (if applicable)

## Example Usage

```
/review "SceneEditor.jsx Implementation"
Review for:
- Code quality & readability
- React best practices
- Performance (no unnecessary re-renders)
- Accessibility compliance
- Test coverage adequacy
- Integration with existing code

Focus areas:
- useEffect dependencies
- State management pattern
- Form validation logic
```

## Review Categories

**CRITICAL** (Must fix):
- Security vulnerabilities
- Breaking changes
- Failed tests
- Architecture violations

**HIGH** (Should fix):
- Performance issues
- Memory leaks
- Missing error handling
- Incomplete tests

**MEDIUM** (Nice to fix):
- Code readability
- Maintainability
- Better patterns available

**LOW** (Optional):
- Style preferences
- Comments
- Alternative approaches

## Typical Flow
1. **Implement** feature
2. **Review** code quality
3. Address review comments
4. **Re-review** changes
5. Approve & merge

## Approval Checklist
✅ No critical issues
✅ Tests passing
✅ Code standards met
✅ Performance acceptable
✅ Security verified
✅ Documentation complete
✅ Ready to merge

## Success Criteria
✅ Code is high quality
✅ Issues identified early
✅ No rework needed post-merge
✅ Maintainable long-term
✅ Standards enforced
✅ Team aligned

## Review Guidelines
- Be specific & actionable
- Explain WHY, not just WHAT
- Suggest improvements
- Acknowledge good work
- Keep tone respectful
- Focus on code, not person
- Comment inline on specific code
- Summary at end

## Notes
- Review before PR (saves time)
- Detailed review prevents bugs
- Good reviews train developers
- Learn from reviews
- Ask questions if unclear
- Test the code locally if possible
- Consider edge cases
