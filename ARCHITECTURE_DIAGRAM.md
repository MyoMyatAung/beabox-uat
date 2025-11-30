# Architecture Diagram: Scroll Restriction Feature

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ImmersiveUserGuide                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Custom Hooks (SOLID Separation of Concerns)               │ │
│  │                                                              │ │
│  │  ┌──────────────────┐  ┌──────────────────┐               │ │
│  │  │ useStageManager  │  │ useVideoController│               │ │
│  │  │  - Stage logic   │  │  - Audio control  │               │ │
│  │  └──────────────────┘  └──────────────────┘               │ │
│  │                                                              │ │
│  │  ┌────────────────────────────┐  ┌─────────────────────┐  │ │
│  │  │useScrollRestrictionManager │  │useGuideVisibility   │  │ │
│  │  │  - Redux state management  │  │  - UI visibility    │  │ │
│  │  └────────────────────────────┘  └─────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌────────────────────────┐                                │ │
│  │  │useScrollInfoTimeout    │                                │ │
│  │  │  - Auto-progress timer │                                │ │
│  │  └────────────────────────┘                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            │ dispatch actions                    │
│                            ▼                                     │
└────────────────────────────────────────────────────────────────┘
                             │
                             │
┌────────────────────────────┴──────────────────────────────────┐
│                      Redux Store                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            scrollRestrictionSlice                        │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  State:                                             │ │ │
│  │  │    - isRestricted: boolean                         │ │ │
│  │  │    - hasReachedSecondVideo: boolean                │ │ │
│  │  │    - maxScrollIndex: number                        │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  Actions:                                               │ │
│  │    • enableScrollRestriction()                          │ │
│  │    • disableScrollRestriction()                         │ │
│  │    • markSecondVideoReached()                           │ │
│  │    • resetScrollRestriction()                           │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────────┬─────────────────┘
                │                              │
                │ useSelector                  │ useSelector
                ▼                              ▼
┌───────────────────────────┐    ┌─────────────────────────────┐
│      Home Component       │    │      PopupLayer            │
│  ┌─────────────────────┐  │    │  ┌───────────────────────┐ │
│  │getRestrictedVideos()│  │    │  │  AdPopup Component    │ │
│  │                     │  │    │  │                       │ │
│  │  if (isRestricted)  │  │    │  │  onComplete:          │ │
│  │    return videos    │  │    │  │    dispatch(          │ │
│  │      .slice(0, 2)   │  │    │  │  disableScroll...()   │ │
│  │  else               │  │    │  │    )                  │ │
│  │    return videos    │  │    │  └───────────────────────┘ │
│  └─────────────────────┘  │    └─────────────────────────────┘
│                           │
│  IntersectionObserver     │
│    tracks video index     │
└───────────────────────────┘
```

## Data Flow Diagram

### Phase 1: Guide Activation

```
App Loads
   │
   ├──> LoadingScreen
   │       │
   ├──> LandingScreen
   │       │
   └──> ImmersiveUserGuide
           │
           ├──> dispatch(enableScrollRestriction())
           │       │
           │       └──> Redux: isRestricted = true
           │
           └──> Home reads state
                   │
                   └──> Only renders 2 videos
```

### Phase 2: User Scrolling

```
User Scrolls Down
   │
   ├──> Home Component (app__videos container)
   │       │
   │       ├──> Video 1 (index 0) ✓ Can see
   │       │
   │       └──> Video 2 (index 1) ✓ Can see
   │
   └──> Try to scroll further... ✗ Blocked (no more videos rendered)
```

### Phase 3: Reaching Second Video

```
Second Video 60% Visible
   │
   ├──> IntersectionObserver fires
   │       │
   │       └──> ImmersiveUserGuide.handleVideoIndexChange(1)
   │               │
   │               ├──> dispatch(markSecondVideoReached())
   │               │       │
   │               │       └──> Redux: hasReachedSecondVideo = true
   │               │
   │               ├──> setShowUserGuide(false)
   │               │       │
   │               │       └──> Guide fades out
   │               │
   │               └──> setShowAd(true)
   │                       │
   │                       └──> Ad Popup appears
   │
   └──> Scroll still restricted (isRestricted = true)
```

### Phase 4: Ad Popup Closed

```
User Closes Ad Popup
   │
   └──> PopupLayer.handleAdPopupComplete()
           │
           ├──> dispatch(disableScrollRestriction())
           │       │
           │       └──> Redux: isRestricted = false
           │
           └──> Home reads new state
                   │
                   └──> Renders all videos
                           │
                           └──> Unrestricted scrolling ✓
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        RootLayout                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  State Management:                                     │  │
│  │    - showUserGuide                                     │  │
│  │    - showAd                                            │  │
│  └────────────┬───────────────────────────────┬───────────┘  │
│               │                               │               │
│               ▼                               ▼               │
│  ┌────────────────────────┐    ┌────────────────────────┐   │
│  │    PopupLayer          │    │      <Outlet>          │   │
│  │  ┌──────────────────┐  │    │    (Route Content)     │   │
│  │  │ ImmersiveUserGuide│ │    │                        │   │
│  │  │  (Priority 5)    │  │    │    ┌────────────────┐  │   │
│  │  └──────────────────┘  │    │    │  Home (/)      │  │   │
│  │           │             │    │    │                │  │   │
│  │           │ onComplete  │    │    │  Enforces      │  │   │
│  │           ▼             │    │    │  Scroll        │  │   │
│  │  ┌──────────────────┐  │    │    │  Restriction   │  │   │
│  │  │   AdPopup        │  │    │    └────────────────┘  │   │
│  │  │  (Priority 6)    │  │    │                        │   │
│  │  └──────────────────┘  │    └────────────────────────┘   │
│  │           │             │                                 │
│  │           │ onComplete  │                                 │
│  │           ▼             │                                 │
│  │  disableScrollRestrict  │                                 │
│  └─────────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```

## Hook Dependency Graph

```
ImmersiveUserGuide Component
   │
   ├──> useStageManager
   │      │
   │      └──> Depends: isFirstTimeUser (Redux)
   │
   ├──> useVideoController
   │      │
   │      ├──> Depends: dispatch (Redux)
   │      └──> Depends: mute (Redux)
   │
   ├──> useScrollRestrictionManager
   │      │
   │      ├──> Depends: dispatch (Redux)
   │      ├──> Depends: currentStage (from useStageManager)
   │      ├──> Depends: setShowAd (prop)
   │      └──> Depends: setShowUserGuide (prop)
   │
   ├──> useGuideVisibility
   │      │
   │      ├──> Depends: hideNew (Redux)
   │      └──> Depends: currentStage (from useStageManager)
   │
   └──> useScrollInfoTimeout
          │
          └──> Independent (no external dependencies)
```

## Redux State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Redux Store                              │
│                                                             │
│  scrollRestriction: {                                       │
│    isRestricted: boolean ────┐                             │
│    hasReachedSecondVideo: boolean                           │
│    maxScrollIndex: number ───┼───────┐                     │
│  }                           │       │                     │
└──────────────────────────────┼───────┼─────────────────────┘
                               │       │
              Read by Home ────┘       │
                                       │
              Used for filtering ──────┘

Actions Flow:
┌──────────────────────┐
│  User Guide Active   │
│  enableScrollRest..()│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ isRestricted = true  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Home filters videos  │
└──────────────────────┘

┌──────────────────────┐
│ Reach Second Video   │
│ markSecondVideo..()  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│hasReachedSecondVideo=true│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────┐
│   Show Ad Popup      │
└──────────────────────┘

┌──────────────────────┐
│   Ad Closed          │
│ disableScrollRest..()│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│isRestricted = false  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│Home renders all vids │
└──────────────────────┘
```

## Sequence Diagram: Complete Flow

```
User    LoadingScreen  LandingScreen  UserGuide  Redux  Home  AdPopup
 │            │              │            │        │      │      │
 │──Open App──│              │            │        │      │      │
 │            │              │            │        │      │      │
 │            │──Load Assets │            │        │      │      │
 │            │──Complete────────────────>│        │      │      │
 │            │              │            │        │      │      │
 │            │              │──Animate───>        │      │      │
 │            │              │──Complete──>        │      │      │
 │            │              │            │        │      │      │
 │            │              │            │──Enable│      │      │
 │            │              │            │  Restr─>      │      │
 │            │              │            │        │      │      │
 │            │              │            │<───Read│      │      │
 │            │              │            │   State│      │      │
 │            │              │            │        │      │      │
 │            │              │            │        │──Render     │
 │            │              │            │        │  2 vids     │
 │            │              │            │        │      │      │
 │──Scroll Down─────────────────────────>│        │      │      │
 │            │              │            │        │      │      │
 │            │              │            │<──Observe     │      │
 │            │              │            │   Video 2     │      │
 │            │              │            │        │      │      │
 │            │              │            │──Mark  │      │      │
 │            │              │            │  2nd───>      │      │
 │            │              │            │        │      │      │
 │            │              │<───Hide────│        │      │      │
 │            │              │            │        │      │──Show│
 │            │              │            │        │      │      │
 │──Close Ad────────────────────────────────────────────────────>
 │            │              │            │        │      │      │
 │            │              │            │    Disable    │      │
 │            │              │            │<───Restr──────│      │
 │            │              │            │        │      │      │
 │            │              │            │        │<─Read│      │
 │            │              │            │        │ State│      │
 │            │              │            │        │      │      │
 │            │              │            │        │──Render     │
 │            │              │            │        │  All vids   │
 │            │              │            │        │      │      │
 │──Scroll Freely──────────────────────────────────────>│      │
 │            │              │            │        │      │      │
```

## File Dependency Graph

```
store.ts
   │
   ├──> scrollRestrictionSlice.ts (new)
   │       │
   │       └──> Exports: actions, reducer
   │
   └──> rootReducer
           │
           └──> scrollRestriction: scrollRestrictionSlice

ImmersiveUserGuide.tsx
   │
   ├──> Imports: scrollRestrictionSlice actions
   ├──> Dispatches: enableScrollRestriction, markSecondVideoReached
   └──> Props: setShowUserGuide, setShowAd

PopupLayer.tsx
   │
   ├──> Imports: scrollRestrictionSlice actions
   ├──> Dispatches: disableScrollRestriction
   └──> Renders: ImmersiveUserGuide, AdPopup

Home.tsx
   │
   ├──> Imports: None (reads from Redux)
   ├──> Selects: scrollRestriction.isRestricted, maxScrollIndex
   └──> Uses: getRestrictedVideos() helper

RootLayout.tsx
   │
   └──> Renders: PopupLayer (with all popups)
```

## State Timeline

```
Time  │ State                                    │ User Sees
──────┼──────────────────────────────────────────┼────────────────────
 0s   │ isRestricted: false                      │ Loading Screen
      │ hasReachedSecondVideo: false             │
──────┼──────────────────────────────────────────┼────────────────────
 2s   │ isRestricted: false                      │ Landing Screen
      │ hasReachedSecondVideo: false             │ (Animation)
──────┼──────────────────────────────────────────┼────────────────────
 3s   │ isRestricted: true  ◄── ENABLED          │ User Guide
      │ hasReachedSecondVideo: false             │ + Video 1
──────┼──────────────────────────────────────────┼────────────────────
 5s   │ isRestricted: true                       │ User scrolls
      │ hasReachedSecondVideo: false             │ Sees Video 2
──────┼──────────────────────────────────────────┼────────────────────
 6s   │ isRestricted: true                       │ Ad Popup
      │ hasReachedSecondVideo: true ◄── MARKED   │ (Guide hidden)
──────┼──────────────────────────────────────────┼────────────────────
10s   │ isRestricted: false ◄── DISABLED         │ All videos
      │ hasReachedSecondVideo: true              │ Unrestricted
──────┴──────────────────────────────────────────┴────────────────────
```

---

**Legend:**
- `│` : Vertical flow
- `├─>` : Branch/Dependency
- `◄──` : State change
- `✓` : Allowed action
- `✗` : Blocked action

