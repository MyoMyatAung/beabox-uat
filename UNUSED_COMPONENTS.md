# Unused Components Report

This document lists all components that are not imported or used anywhere in the codebase.

## Components in `src/components/`

### UI Components
1. **`src/components/ui/textarea.tsx`** - Textarea component (not imported; files use native HTML textarea)
2. **`src/components/ui/badge.tsx`** - Badge component (not imported; BadgeImg is used instead)
3. **`src/components/ui/drawer1.tsx`** - Drawer variant (USED in register-drawer.tsx)

### Ranking Components
4. **`src/components/ranking/filter-type.tsx`** - Filter type component

### Create Center Components
5. **`src/components/create-center/top-rank-card2.tsx`** - Top rank card variant 2
6. **`src/components/create-center/my-rank.tsx`** - My rank component (not imported; my-rank-card is used instead)

### Shared Components
7. **`src/components/shared/right-side-actions.tsx`** - Right side actions component
8. **`src/components/shared/min-loader.tsx`** - Minimal loader component
9. **`src/components/shared/slider.tsx`** - Slider component (not imported; SlidersHorizontal icon from lucide-react is used instead)

### Profile Components
10. **`src/components/profile/follow/my-follow-card.tsx`** - My follow card component
11. **`src/components/profile/menu-card.tsx`** - Menu card component
12. **`src/components/profile/noti/other-noti.tsx`** - Other notification component
13. **`src/components/profile/noti/balance-noti-link.tsx`** - Balance notification link component
14. **`src/components/profile/noti/system-noti-link.tsx`** - System notification link component
15. **`src/components/profile/sticky-tabs.tsx`** - Sticky tabs component
16. **`src/components/profile/upload-profile.tsx`** - Upload profile component (mentioned in profileApi.ts but not imported)

### Other Components
17. **`src/components/UserFeed.tsx`** - User feed component (different from UserFeedSet which is used in routing)

### Auth Components (USED via lazy loading in Routing.tsx)
- `src/components/profile/auth/check-answer.tsx` - USED
- `src/components/profile/auth/reset-password.tsx` - USED
- `src/components/profile/auth/forgot-password.tsx` - USED

## Page Components in `src/page/home/components/`

18. **`src/page/home/components/TwoColumns.tsx`** - Two columns layout component
19. **`src/page/home/components/VideoFeedVirtual.tsx`** - Virtual video feed component
20. **`src/page/home/components/VideoFeedVirtualTemp.tsx`** - Temporary virtual video feed component
21. **`src/page/home/components/VideoFeedVirtualSuccess.tsx`** - Success virtual video feed component

## Summary

**Total Unused Components: 18**

**Note:** `drawer1.tsx` is USED, so it should not be counted as unused.

### Confirmed Unused:
1. `src/components/ui/textarea.tsx`
2. `src/components/ui/badge.tsx`
3. `src/components/ranking/filter-type.tsx`
4. `src/components/create-center/top-rank-card2.tsx`
5. `src/components/shared/right-side-actions.tsx`
6. `src/components/shared/min-loader.tsx`
7. `src/components/profile/follow/my-follow-card.tsx`
8. `src/components/profile/menu-card.tsx`
9. `src/components/profile/noti/other-noti.tsx`
10. `src/components/profile/noti/balance-noti-link.tsx`
11. `src/components/profile/noti/system-noti-link.tsx`
12. `src/components/profile/sticky-tabs.tsx`
13. `src/components/profile/upload-profile.tsx`
14. `src/components/UserFeed.tsx`
15. `src/page/home/components/TwoColumns.tsx`
16. `src/page/home/components/VideoFeedVirtual.tsx`
17. `src/page/home/components/VideoFeedVirtualTemp.tsx`
18. `src/page/home/components/VideoFeedVirtualSuccess.tsx`

### Note:
- Components used via lazy loading in `Routing.tsx` are considered USED
- Components imported by other components are considered USED
- Some components may be used dynamically or conditionally - manual review recommended before deletion

