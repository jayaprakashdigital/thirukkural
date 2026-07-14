# /bugfix - Bug Fixing Command

## Purpose
Used for debugging, diagnosing, and fixing issues in existing code.

## When to Use
- User reports a bug
- QA finds a defect
- Production issue
- Test failing unexpectedly
- Feature not working as designed

## What Agents to Invoke
- **Code Reviewer** - Identify problem area
- **QA Reviewer** - Verify reproduction steps
- **Frontend Engineer** - UI/logic bugs
- **Backend Engineer** - API/data bugs
- **Database Architect** - Data issues
- **Prompt Engineer** - AI-related issues

## Input Required
- Bug report (title, description)
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots/videos (if applicable)
- Environment (dev/staging/prod)
- Affected users/data

## Output Expected
- Root cause analysis
- Fix implemented & tested
- Test case to prevent regression
- Updated documentation
- Deployment notes (if production)

## Example Usage

```
/bugfix "Scene Editor Form Not Saving"
Bug Report:
- User creates scene with narration
- Clicks Save
- Form clears, but no confirmation appears
- Scene not found in database

Steps:
1. Open scene editor
2. Enter narration: "Test text"
3. Click Save
4. Expected: Success toast + redirect
5. Actual: Nothing happens, no error

Environment: Development
Browser: Chrome 120
```

## Bug Analysis Process

1. **Reproduce**: Verify you can reproduce the bug
2. **Isolate**: Narrow down which code is causing it
3. **Identify**: Understand root cause
4. **Fix**: Make minimal change to fix
5. **Test**: Verify fix works
6. **Prevent**: Add test to prevent regression

## Common Bug Categories

**Data Issues**:
- Data not saving to database
- Data persisting after delete
- Wrong data displayed
- Stale data showing

**UI/Logic Issues**:
- Button not working
- Form not validating
- Component not rendering
- State not updating

**API/Integration**:
- API call failing
- Response not handled
- Error not caught
- Timeout occurring

**Performance**:
- Page loads slowly
- Form is laggy
- Memory leak
- CPU spike

**Security**:
- Injection vulnerability
- Authorization bypass
- Data leak
- CSRF vulnerability

## Debugging Checklist

For frontend bugs:
- [ ] Check browser console (errors/warnings)
- [ ] Inspect network tab (API calls)
- [ ] Check React DevTools
- [ ] Verify browser compatibility
- [ ] Clear cache & reload
- [ ] Check localStorage/sessionStorage

For backend bugs:
- [ ] Check server logs
- [ ] Verify database state
- [ ] Test API with Postman
- [ ] Check authentication/authorization
- [ ] Verify environment variables
- [ ] Review recent changes

## Fix Validation

Before considering bug fixed:
- [ ] Reproduces original issue
- [ ] Fix resolves the issue
- [ ] No new issues introduced
- [ ] Regression test added
- [ ] Related issues checked
- [ ] Code review approved
- [ ] Works in all browsers
- [ ] Works on mobile/desktop

## Typical Flow
1. **Report** bug with details
2. **Reproduce** to understand
3. **Fix** root cause
4. **Test** extensively
5. **Deploy** fix
6. **Monitor** for recurrence

## Documentation
- Update bug report with root cause
- Add regression test
- Update related documentation
- Document workaround (if temporary fix)
- Track in issue tracker

## Severity Levels

**CRITICAL**: System down, data loss, security
→ Fix immediately, deploy ASAP

**HIGH**: Major functionality broken
→ Fix in current sprint, deploy this week

**MEDIUM**: Feature not working as intended
→ Fix in current sprint, deploy when ready

**LOW**: Minor issue, workaround exists
→ Fix when convenient, deploy with next release

## Prevention
- Add test case for bug
- Review similar code for same issue
- Update error handling
- Improve logging
- Document as edge case
