# Script Module V2 - Architecture Overview

> **Complete architecture plan**: See `/tmp/SCRIPT_MODULE_ARCHITECTURE_PLAN.md`

## Quick Reference

### Sections (Expand to Full Plan)
1. Current Architecture Review
2. Strengths of Current Implementation
3. Weaknesses
4. Gap Analysis (Current vs Future)
5. **Recommended Information Architecture**
6. **Recommended Database Schema**
7. **Recommended UI Layout**
8. Scene Editor Design
9. Relationship with Character Library
10. Relationship with Image Library
11. Relationship with Video Library
12. Future Scalability for 1330 Kurals
13. Development Phases
14. Potential Risks
15. Recommendations
16. Estimated Development Complexity

### Core Transformation

**From**: Flat prompt generator with list + modal view
**To**: Scene-based production pipeline with timeline, editor, approvals

### Data Model

```javascript
SCRIPT (new)
├─ kuralId → KURAL
├─ storyId → STORY
├─ metadata (created, status, version)
└─ scenes[] (5-10 per script)
   ├─ sceneNumber, duration, title
   ├─ location (linked to LOCATION_LIBRARY)
   ├─ characters[] (linked to CHARACTER_LIBRARY)
   ├─ narration & dialogue
   ├─ technical (camera, lighting, emotion, music)
   ├─ prompts (image, video)
   └─ production (status, generated images/videos)
```

### Component Structure

```
ScriptModule/
├─ ScriptListView (filters, grid/list)
├─ ScriptDetail (tabs: timeline, metadata)
├─ SceneTimeline (all scenes at once)
├─ SceneEditor (full form with tabs)
│  ├─ ContentTab (narration, dialogue, location)
│  ├─ TechnicalTab (camera, lighting, music)
│  ├─ ProductionTab (status, images, videos)
│  └─ HistoryTab (versions, changes)
├─ Selectors (Character, Location, Music, Camera, Props)
└─ AIActionsPanel
```

### Development Phases

| Phase | Focus | Duration | Components |
|-------|-------|----------|------------|
| **1A** | Scene model & editor | 2 weeks | Editor, Timeline, Save |
| **1B** | List redesign & filters | 1 week | List, Filters, Cards |
| **2A-D** | Library integrations | 3 weeks | 5 library connectors |
| **3A-C** | AI, versioning, approval | 3 weeks | AI actions, History, Workflow |
| **4A-B** | Export, batch, publish | 2 weeks | PDF, JSON, Bulk ops |
| **5** | Polish, test, optimize | 2 weeks | Performance, Accessibility |

### API Endpoints (Phase 1A)

```
Scripts:
GET    /api/scripts
GET    /api/scripts/:id
POST   /api/scripts
PUT    /api/scripts/:id
DELETE /api/scripts/:id

Scenes:
GET    /api/scripts/:scriptId/scenes
POST   /api/scenes
PUT    /api/scenes/:id
DELETE /api/scenes/:id
```

### State Management

- Local state: Component-level (useState)
- Global state: Context API for:
  - Current script (editing)
  - User preferences (theme, etc.)
  - Sidebar navigation state
- Server state: React Query or SWR (for API data)

### Performance Targets

- Page load: < 1 second
- Scene editor: < 2 seconds
- Timeline render (1330 scenes): < 2 seconds (virtual scrolling)
- Search/filter: < 500ms
- API response: < 500ms
- Database query: < 200ms

### Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation throughout
- Screen reader support (ARIA labels)
- Color contrast ≥ 4.5:1
- Touch targets ≥ 44px
- Focus indicators visible

### Security

- Authentication required (inherit from existing)
- Authorization checks (user owns script)
- Input validation (all fields)
- SQL injection prevention (parameterized)
- XSS prevention (proper escaping)
- CSRF tokens on state-changing operations

### Testing Strategy

- Unit tests: Component behavior, utilities
- Integration tests: Form + API, list + filters
- E2E tests: Create script → edit → save workflow
- Accessibility tests: Manual + automated (axe-core)
- Performance tests: Load time, render time
- Cross-browser tests: Chrome, Firefox, Safari, Edge

---

**For detailed architecture (16 sections), see:**
`/tmp/SCRIPT_MODULE_ARCHITECTURE_PLAN.md`
