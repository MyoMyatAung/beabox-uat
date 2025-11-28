# Unused API Calls Report

This document lists all API hooks that are exported but never imported or used anywhere in the codebase.

## Summary

**Total Unused API Hooks: 4**

## Detailed List

### 1. `useGetFollowPostsQuery`
- **File:** `src/page/home/services/homeApi.tsx`
- **Endpoint:** `getFollowPosts`
- **URL:** `/posts/following`
- **Method:** GET
- **Status:** ❌ **UNUSED**
- **Note:** Only found in the API file itself, never imported or used in any component

---

### 2. `useGetExplorePostsQuery`
- **File:** `src/page/home/services/homeApi.tsx`
- **Endpoint:** `getExplorePosts`
- **URL:** `/posts/explore?pageSize=10&page=${page}`
- **Method:** GET
- **Status:** ❌ **UNUSED**
- **Note:** Only found in the API file itself, never imported or used in any component
- **Alternative:** There's a similar endpoint `getExploreList` in `exploreApi.tsx` that is used

---

### 3. `useGetlikePostListQuery`
- **File:** `src/store/api/profileApi.ts`
- **Endpoint:** `getlikePostList`
- **URL:** `/user/liked-post?user_id=${id}&page=${page}`
- **Method:** GET
- **Status:** ❌ **UNUSED**
- **Note:** Only found in the API file itself, never imported or used in any component
- **Alternative:** There's a similar endpoint `getLikedPost` in the same file that is used

---

### 4. `useGetSuggestionsQuery`
- **File:** `src/store/api/search/searchApi.tsx`
- **Endpoint:** `getSuggestions`
- **URL:** `/post-suggestions?search=${query}&page=${page}`
- **Method:** GET
- **Status:** ❌ **UNUSED**
- **Note:** Only found in the API file itself, never imported or used in any component
- **Alternative:** `useLazyGetSuggestionsQuery` (lazy version) is used in `src/page/search/Search.tsx` and `src/page/search/page/Results.tsx`

---

## Analysis

### Why These Are Unused

1. **`useGetFollowPostsQuery`** - Likely replaced by `useGetFollowedPostsQuery` which is actively used
2. **`useGetExplorePostsQuery`** - Likely replaced by `useGetExploreListQuery` from `exploreApi.tsx`
3. **`useGetlikePostListQuery`** - Duplicate of `useGetLikedPostQuery` which is used instead
4. **`useGetSuggestionsQuery`** - The lazy version `useLazyGetSuggestionsQuery` is preferred and used

### Recommendations

1. **Remove unused hooks** to reduce bundle size and code complexity
2. **Verify before deletion** - Check if these endpoints are called directly via RTK Query's `dispatch` or `initiate` methods
3. **Consider deprecation** - If unsure, mark as deprecated first before removing

### Safe to Remove

All 4 hooks appear to be safe to remove as they have:
- No imports found in the codebase
- Alternative implementations that are actively used
- No direct API calls via `dispatch` or `initiate`

---

## Verification Steps

Before removing these hooks, verify:

1. **Search for direct API calls:**
   ```bash
   grep -r "getFollowPosts\|getExplorePosts\|getlikePostList\|getSuggestions" src
   ```

2. **Check for RTK Query dispatch usage:**
   ```bash
   grep -r "dispatch.*getFollowPosts\|dispatch.*getExplorePosts\|dispatch.*getlikePostList\|dispatch.*getSuggestions" src
   ```

3. **Check for initiate calls:**
   ```bash
   grep -r "initiate.*getFollowPosts\|initiate.*getExplorePosts\|initiate.*getlikePostList\|initiate.*getSuggestions" src
   ```

---

## Impact Analysis

**Benefits of Removal:**
- Reduced bundle size
- Cleaner codebase
- Less confusion about which hook to use
- Easier maintenance

**Potential Risks:**
- If used via direct dispatch/initiate (unlikely but possible)
- If used in dynamically imported code (should check build output)

---

## Related Endpoints

### Similar/Alternative Endpoints That Are Used

1. **Instead of `useGetFollowPostsQuery`:**
   - ✅ `useGetFollowedPostsQuery` - Used in `Home.tsx`

2. **Instead of `useGetExplorePostsQuery`:**
   - ✅ `useGetExploreListQuery` - Used in `explore/comp/Latest.tsx`, `explore/comp/Recommand.tsx`

3. **Instead of `useGetlikePostListQuery`:**
   - ✅ `useGetLikedPostQuery` - Used in `components/profile/video/liked-videos.tsx`, `components/profile/video/like-videos2.tsx`

4. **Instead of `useGetSuggestionsQuery`:**
   - ✅ `useLazyGetSuggestionsQuery` - Used in `page/search/Search.tsx`, `page/search/page/Results.tsx`

