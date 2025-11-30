# Duplicated API Calls Report

This document lists all API endpoints that are duplicated across multiple API files in the codebase.

## Summary

**Total Duplicated Endpoints: 9**

## Detailed Duplications

### 1. `/user/share/info` - User Share Info
**Duplicated in 3 files:**

- **`src/page/home/services/homeApi.tsx`**
  - Endpoint: `getUserShare`
  - Query: `/user/share/info?type=${type}&id=${id}&qr_code=${qr_code}`
  - Hook: `useGetUserShareQuery`

- **`src/store/api/events/eventApi.tsx`**
  - Endpoint: `getUserShareInfo`
  - Query: `/user/share/info`
  - Hook: `useGetUserShareInfoQuery`

- **`src/store/api/profileApi.ts`**
  - Endpoint: `userShareInfo`
  - Query: `/user/share/info`
  - Hook: `useUserShareInfoQuery`

**Recommendation:** Consolidate into a single endpoint in `profileApi.ts` or `homeApi.tsx` since it's user-related data.

---

### 2. `/config/data` - Configuration Data
**Duplicated in 4 files:**

- **`src/page/home/services/homeApi.tsx`**
  - Endpoint: `getConfig`
  - Query: `/config/data`
  - Hook: `useGetConfigQuery`

- **`src/store/api/createCenterApi.ts`**
  - Endpoint: `getConfig`
  - Query: `/config/data`
  - Hook: `useGetConfigQuery`

- **`src/store/api/profileApi.ts`**
  - Endpoint: `getConfig`
  - Query: `/app/version?platform=${os}` (Different endpoint, but similar purpose)
  - Hook: `useGetConfigQuery`

- **`src/store/api/wallet/walletApi.tsx`**
  - Endpoint: `getInvite`
  - Query: `/config/data`
  - Hook: `useGetInviteQuery`

**Recommendation:** Create a dedicated `configApi.ts` file to centralize all configuration-related endpoints.

---

### 3. `/profile/get-own-profile` - Get Own Profile
**Duplicated in 3 files:**

- **`src/store/api/profileApi.ts`**
  - Endpoint: `getMyOwnProfile`
  - Query: `/profile/get-own-profile`
  - Hook: `useGetMyOwnProfileQuery`

- **`src/store/api/createCenterApi.ts`**
  - Endpoint: `getMyOwnProfile`
  - Query: `/profile/get-own-profile`
  - Hook: `useGetMyOwnProfileQuery`

- **`src/page/luckywheel/services/spinWheelApi.ts`**
  - Endpoint: `getProfile`
  - Query: `/profile/get-own-profile`
  - Hook: `useGetProfileQuery`

**Recommendation:** Keep in `profileApi.ts` as the single source of truth. Other APIs should import and use it.

---

### 4. `/events/current` - Current Event
**Duplicated in 2 files:**

- **`src/store/api/events/eventApi.tsx`**
  - Endpoint: `getCurrentEvent`
  - Query: `/events/current`
  - Hook: `useGetCurrentEventQuery`

- **`src/page/luckywheel/services/spinWheelApi.ts`**
  - Endpoint: `getCurrentEvent`
  - Query: `/events/current`
  - Hook: `useGetCurrentEventQuery`

**Recommendation:** Keep in `eventApi.tsx` and have `spinWheelApi.ts` import from it, or create a shared event service.

---

### 5. `/events/detail` - Event Details
**Duplicated in 2 files:**

- **`src/store/api/events/eventApi.tsx`**
  - Endpoint: `getEventDetails`
  - Query: `/events/detail?event_id=${id}`
  - Hook: `useLazyGetEventDetailsQuery`

- **`src/page/luckywheel/services/spinWheelApi.ts`**
  - Endpoint: `getEventDetails`
  - Query: `/events/detail?event_id=${eventId}`
  - Hook: `useGetEventDetailsQuery`

**Recommendation:** Same as above - consolidate in `eventApi.tsx`.

---

### 6. `/app/ads` - Application Ads
**Duplicated in 3 files:**

- **`src/store/api/explore/exploreApi.tsx`**
  - Endpoint: `getAdsPopUp`
  - Query: `/app/ads`
  - Hook: `useGetAdsPopUpQuery`

- **`src/store/api/createCenterApi.ts`**
  - Endpoint: `getAds`
  - Query: `/app/ads`
  - Hook: `useGetAdsQuery`

- **`src/utils/helperService.ts`**
  - Function: `getAdsData`
  - Query: `/app/ads`
  - Custom hook: `useGetAdsPopUpQuery` (not RTK Query)

**Recommendation:** Consolidate into `exploreApi.tsx` or create a dedicated `adsApi.ts` file. Remove the custom implementation in `helperService.ts` and use RTK Query instead.

---

### 7. `/storage/upload` - File Upload
**Duplicated in 2 files:**

- **`src/store/api/profileApi.ts`**
  - Endpoint: `settingUpload`
  - Query: `/storage/upload`
  - Method: POST
  - Hook: `useSettingUploadMutation`
  - Body: `{ filePath, file: filedata }`

- **`src/store/api/wallet/walletApi.tsx`**
  - Endpoint: `WallUploadImage`
  - Query: `/storage/upload`
  - Method: POST
  - Hook: `useWallUploadImageMutation`
  - Body: `{ filePath: string, file: string }`

**Recommendation:** Create a shared `uploadApi.ts` file for all file upload operations, or consolidate into one of the existing APIs.

---

### 8. `/follower/change-follow-status` - Change Follow Status
**Duplicated in 2 files:**

- **`src/page/home/services/homeApi.tsx`**
  - Endpoint: `followStatus`
  - Query: `/follower/change-follow-status`
  - Method: POST
  - Hook: `useFollowStatusMutation`
  - Body: `{ follow_user_id, status }`

- **`src/store/api/profileApi.ts`**
  - Endpoint: `changeFollowStatus`
  - Query: `/follower/change-follow-status`
  - Method: POST
  - Hook: `useChangeFollowStatusMutation`
  - Body: `{ follow_user_id, status }`

**Recommendation:** Consolidate into `profileApi.ts` since it's user/profile related functionality.

---

### 9. `/posts/search` - Posts Search
**Duplicated in 2 files:**

- **`src/store/api/profileApi.ts`**
  - Endpoint: `postsSearch`
  - Query: `/posts/search`
  - Method: POST
  - Hook: `usePostsSearchMutation`
  - Body: `{ page, pageSize: 12, search, user_id }`

- **`src/store/api/search/searchApi.tsx`**
  - Endpoint: `postSearch`
  - Query: `/posts/search?search=${search}&tab=${tab}&page=${page}`
  - Method: POST
  - Hook: `usePostSearchMutation`
  - Body: None (parameters in URL)

**Recommendation:** Consolidate into `searchApi.tsx` since it's search-related functionality. Standardize on either URL parameters or body payload.

---

## Additional Observations

### Similar Endpoints (Not Exact Duplicates)

1. **Profile Upload Endpoints:**
   - `profileApi.ts`: `profileUpload` → `/profile/upload`
   - `profileApi.ts`: `uploadProfilePic` → `/profile/upload`
   - These are in the same file but serve similar purposes - consider consolidating

---

## Recommendations

### High Priority
1. **Consolidate `/user/share/info`** - Used in 3 different APIs
2. **Consolidate `/config/data`** - Used in 4 different APIs
3. **Consolidate `/app/ads`** - Used in 3 different APIs (including custom implementation)

### Medium Priority
4. **Consolidate `/profile/get-own-profile`** - Used in 3 different APIs
5. **Consolidate `/events/current` and `/events/detail`** - Used in 2 different APIs
6. **Consolidate `/storage/upload`** - Used in 2 different APIs
7. **Consolidate `/follower/change-follow-status`** - Used in 2 different APIs
8. **Consolidate `/posts/search`** - Used in 2 different APIs (different implementations)

### Low Priority
7. **Review similar endpoints** - Profile upload, posts search, follow status

### Best Practices
- Create a shared API service layer for common endpoints
- Use RTK Query's code splitting features to share endpoints across APIs
- Consider creating a `commonApi.ts` for shared endpoints like config, upload, etc.
- Remove custom implementations (like in `helperService.ts`) in favor of RTK Query

---

## Impact Analysis

**Benefits of Consolidation:**
- Reduced code duplication
- Easier maintenance
- Consistent error handling
- Better caching (RTK Query cache sharing)
- Smaller bundle size
- Single source of truth for API contracts

**Potential Issues:**
- May require refactoring components that use these hooks
- Need to ensure backward compatibility during migration
- May need to update import statements across the codebase

