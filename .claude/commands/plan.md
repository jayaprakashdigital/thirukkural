# /plan - Architecture & Design Planning Command

## Purpose
Used for architecture decisions, design planning, and breaking down complex features into implementation steps.

## When to Use
- Planning a new feature
- Designing system architecture
- Breaking down large tasks into phases
- Making significant design decisions
- Reviewing overall approach before coding

## What Agents to Invoke
- **UI/UX Designer** - Layout & interaction design
- **Backend Engineer** - API & database design
- **Database Architect** - Schema & query strategy
- **Animation Director** - Artistic/creative direction
- **Prompt Engineer** - AI integration planning

## Output Expected
- Architecture diagram (text-based)
- Component breakdown
- API specification (endpoints, payloads)
- Database schema
- Timeline/phasing
- Risk assessment
- Recommendations

## Example Usage

```
/plan "Scene Editor Component Architecture"
- Break down the scene editor into child components
- Design the data flow (props, state, callbacks)
- Identify reusable components
- Plan integration with libraries
- Estimate effort for each component
```

## Typical Flow
1. **Plan** what to build
2. Review plan (approve/request changes)
3. **Implement** based on plan
4. **Review** code against plan
5. **Test** that plan is fulfilled

## Success Criteria
✅ Clear architecture documented
✅ Components/APIs well-defined
✅ Data flow understood
✅ Dependencies identified
✅ Timeline reasonable
✅ Risks identified & mitigated
✅ Stakeholders agree

## Notes
- Planning prevents rework
- Detailed planning saves implementation time
- Plan is a guide, not gospel (can adjust)
- Document assumptions
- Get stakeholder buy-in before implementing
