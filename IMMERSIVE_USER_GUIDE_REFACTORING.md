# ImmersiveUserGuide Component Refactoring

## Overview

This document describes the refactoring of the `ImmersiveUserGuide.tsx` component and the implementation of the new scroll restriction feature.

## Changes Made

### 1. Component Refactoring (SOLID Principles)

The `ImmersiveUserGuide` component has been completely refactored following SOLID design principles:

#### Single Responsibility Principle (SRP)
- **Separated concerns into custom hooks:**
  - `useStageManager`: Manages guide stages and transitions
  - `useVideoController`: Controls video mute/unmute functionality
  - `useScrollRestrictionManager`: Manages scroll restriction state in Redux
  - `useGuideVisibility`: Manages guide visibility and animation states
  - `useScrollInfoTimeout`: Manages timeout for scroll info stage

#### Open/Closed Principle (OCP)
- Stages are defined in a configuration object (`STAGES`)
- Easy to add new stages without modifying core logic
- Stage transitions are handled through pure functions

#### Liskov Substitution Principle (LSP)
- All callbacks follow consistent interfaces
- Hooks can be replaced with alternative implementations without breaking functionality

#### Interface Segregation Principle (ISP)
- Separate interfaces for different concerns (props, Redux state)
- Each hook returns only what's needed by the consuming component

#### Dependency Inversion Principle (DIP)
- Component depends on abstractions (hooks) not concrete implementations
- Redux actions are injected through dispatch
- Callbacks are passed as props

### 2. New Feature: Scroll Restriction

#### Business Logic

**Requirement:** After entering the app, users can only scroll to the second video. Once they reach the second video, the Ad Popup is rendered. After closing the Ad Popup, users can scroll freely to all videos.

**Implementation:**

1. **Redux State Management (`scrollRestrictionSlice.ts`)**
   - New Redux slice to manage scroll restriction state globally
   - States:
     - `isRestricted`: Whether scrolling is currently restricted
     - `hasReachedSecondVideo`: Whether user has reached the second video
     - `maxScrollIndex`: Maximum video index user can scroll to (default: 1)

2. **Component Changes**

   **ImmersiveUserGuide.tsx:**
   - Enables scroll restriction when guide becomes active
   - Uses IntersectionObserver to detect when user reaches second video
   - Triggers Ad Popup when second video is reached
   - Marks second video as reached in Redux state

   **PopupLayer.tsx:**
   - Disables scroll restriction when Ad Popup is closed
   - Allows unlimited scrolling after Ad is dismissed

   **Home.tsx:**
   - Reads scroll restriction state from Redux
   - Filters video array to show only first 2 videos when restricted
   - Shows all videos when restriction is disabled
   - Uses `getRestrictedVideos()` helper function

3. **Redux Store (`store.ts`)**
   - Added `scrollRestriction` slice to root reducer
   - State is accessible throughout the app

### 3. Code Quality Improvements

#### Comprehensive Comments
- Added detailed JSDoc comments for all functions and hooks
- Business logic explained for each major section
- Purpose, responsibility, and usage documented for each hook

#### Type Safety
- Proper TypeScript interfaces for all props and state
- Type-safe Redux selectors
- Strongly typed function signatures

#### Performance Optimizations
- Memoized callbacks using `useCallback`
- Efficient state management with separate concerns
- Minimal re-renders through proper dependency arrays

## File Structure

```
src/
├── components/
│   └── ImmersiveUserGuide.tsx          # Refactored main component
├── store/
│   ├── slices/
│   │   └── scrollRestrictionSlice.ts   # New Redux slice for scroll restriction
│   └── store.ts                         # Updated with new slice
├── layouts/
│   └── components/
│       └── PopupLayer.tsx               # Updated to disable scroll restriction
└── page/
    └── home/
        └── Home.tsx                     # Updated to enforce scroll restriction
```

## Usage Flow

### 1. App Launch
```
User opens app
  → Loading screen
  → Landing screen
  → ImmersiveUserGuide activates
  → scrollRestriction.isRestricted = true
```

### 2. User Guide Active
```
User sees first video (index 0)
  → Can scroll to second video (index 1)
  → Cannot scroll beyond second video
  → Home component only renders first 2 videos
```

### 3. Reaching Second Video
```
User scrolls to second video (index 1)
  → IntersectionObserver detects second video
  → scrollRestriction.hasReachedSecondVideo = true
  → User guide hides
  → Ad Popup shows
```

### 4. Ad Popup Closed
```
User closes Ad Popup
  → scrollRestriction.isRestricted = false
  → Home component renders all videos
  → User can now scroll freely
```

## API Reference

### Redux Actions

#### `enableScrollRestriction()`
Enables scroll restriction. Called when user guide becomes active.

```typescript
dispatch(enableScrollRestriction());
```

#### `disableScrollRestriction()`
Disables scroll restriction. Called when Ad Popup is closed.

```typescript
dispatch(disableScrollRestriction());
```

#### `markSecondVideoReached()`
Marks that user has reached the second video.

```typescript
dispatch(markSecondVideoReached());
```

#### `resetScrollRestriction()`
Resets scroll restriction state. Called on app reset or user logout.

```typescript
dispatch(resetScrollRestriction());
```

### Redux Selectors

#### Reading Scroll Restriction State

```typescript
const { isRestricted, hasReachedSecondVideo, maxScrollIndex } = useSelector(
  (state: RootState) => state.scrollRestriction
);
```

### Custom Hooks (Internal)

#### `useStageManager(isFirstTimeUser: boolean)`
Manages guide stages and transitions.

**Returns:**
- `currentStage`: Current stage of the guide
- `setCurrentStage`: Function to manually set stage
- `transitionToNextStage`: Function to transition to next stage

#### `useVideoController(dispatch, mute)`
Controls video audio functionality.

**Returns:**
- `unmuteAllVideos`: Function to unmute all videos
- `handleAudioToggle`: Function to toggle audio state

#### `useScrollRestrictionManager(dispatch, currentStage, setShowAd, setShowUserGuide)`
Manages scroll restriction in Redux.

**Returns:**
- `hasReachedSecondVideo`: Whether user has reached second video
- `handleVideoIndexChange`: Function to handle video index changes

#### `useGuideVisibility(hideNew, currentStage)`
Manages guide visibility and animations.

**Returns:**
- `showGuide`: Whether guide should be visible
- `isHidden`: Whether guide is hidden (for animation)
- `setIsHidden`: Function to set hidden state

#### `useScrollInfoTimeout()`
Manages timeout for scroll info stage.

**Returns:**
- `scrollInfoTimeoutRef`: Ref to timeout
- `clearScrollInfoTimeout`: Function to clear timeout

## Testing Checklist

- [ ] First-time user sees full guide flow
- [ ] Returning user sees simplified flow
- [ ] Scroll restriction activates during guide
- [ ] Can scroll to second video only
- [ ] Cannot scroll beyond second video
- [ ] Ad Popup appears when reaching second video
- [ ] After closing Ad, can scroll to all videos
- [ ] Video audio controls work correctly
- [ ] Fullscreen toggle works correctly
- [ ] Stage transitions are smooth
- [ ] No linter errors
- [ ] TypeScript types are correct

## Performance Considerations

1. **Minimal Re-renders**: Custom hooks use `useCallback` and proper dependencies
2. **Efficient DOM Operations**: IntersectionObserver is used instead of scroll listeners
3. **Memoized Calculations**: Video filtering happens only when state changes
4. **Clean Cleanup**: All observers and timers are properly cleaned up

## Backward Compatibility

- Existing functionality remains unchanged
- New scroll restriction is additive
- No breaking changes to props or Redux state
- Works seamlessly with existing popup flow

## Future Enhancements

1. **Configurable Restriction**: Make `maxScrollIndex` configurable via API
2. **Analytics**: Track user interactions with guide and scroll restriction
3. **A/B Testing**: Support for testing different restriction strategies
4. **Animation Improvements**: Add smooth scroll lock animations
5. **Accessibility**: Add ARIA labels and keyboard navigation support

## Maintenance Notes

- All business logic is documented inline with comments
- Each hook is self-contained and testable
- Redux state is centralized for easy debugging
- TypeScript provides compile-time safety
- Code follows consistent naming conventions

## Related Documentation

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [SOLID Principles in React](https://khalilstemmler.com/articles/solid-principles/solid-typescript/)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

**Last Updated:** November 28, 2025  
**Author:** AI Assistant  
**Version:** 1.0.0

