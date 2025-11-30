# Testing Guide: Scroll Restriction Feature

## Quick Start

**Development Server:** http://localhost:5173/

## Testing Prerequisites

### 1. Clear Browser Storage (Important!)
To test as a first-time user, you must clear browser storage:

**Chrome/Edge:**
1. Open Developer Tools (F12)
2. Go to Application tab
3. Clear Storage section → Clear site data

**Firefox:**
1. Open Developer Tools (F12)
2. Go to Storage tab
3. Right-click each storage type → Delete All

**Or use Incognito/Private Mode**

### 2. Open Browser Console
Keep the console open to see debug logs:
- `ImmersiveUserGuide: Component mounted`
- Redux state changes
- Video index tracking

## Test Scenarios

### Scenario 1: First-Time User Flow (Primary Test)

**Steps:**
1. Clear browser storage
2. Navigate to http://localhost:5173/
3. Wait for loading screen to complete
4. Wait for landing screen animation

**Expected Behavior:**

**Stage 1 - Initial Guide:**
- ✅ See user guide overlay with controls on right side
- ✅ See fullscreen button (退出清屏)
- ✅ See audio toggle button if muted (取消静音)
- ✅ Videos should be muted by default
- ✅ Can scroll to first video (index 0)

**Stage 2 - Scroll Restriction Active:**
- ✅ Try scrolling down: Should be able to reach second video (index 1)
- ✅ Try scrolling further: Should NOT be able to go beyond second video
- ✅ Only 2 videos should be rendered in the DOM
- ✅ Check Redux state: `scrollRestriction.isRestricted` should be `true`

**Stage 3 - Clicking Fullscreen Button:**
- ✅ Click the fullscreen button (退出清屏)
- ✅ Guide transitions to SCROLL_INFO stage
- ✅ See scroll instruction: "向上或向下滑动以切换视频"
- ✅ See arrows (up and down)
- ✅ See "点击关闭沉浸模式" message with hand pointer
- ✅ Can click anywhere to close OR wait 3 seconds

**Stage 4 - Guide Completes:**
- ✅ After 3 seconds OR clicking anywhere:
  - User guide fades out
  - Ad Popup appears
  - Scroll restriction still active (can only see 2 videos)

**Stage 5 - After Ad Popup Closes:**
- ✅ Close the Ad Popup
- ✅ Redux: `scrollRestriction.isRestricted` should become `false`
- ✅ Can now scroll to all videos (unrestricted)
- ✅ All videos should be rendered in the DOM

### Scenario 2: Clicking Fullscreen Button

**Steps:**
1. Clear browser storage
2. Navigate to app
3. Scroll down once (to trigger CLR_SCREEN_INFO stage)
4. Click the fullscreen button (退出清屏)

**Expected Behavior:**
- ✅ UI controls become visible (bottom nav, top nav)
- ✅ Videos unmute automatically
- ✅ User guide transitions to "Scroll Info" stage
- ✅ Shows "向上或向下滑动以切换视频" instruction with arrows
- ✅ Shows "点击关闭沉浸模式" message with hand pointer
- ✅ Auto-completes after 3 seconds (or click anywhere to close)
- ✅ Shows Ad Popup
- ✅ Scroll restriction still applies until Ad is closed

### Scenario 3: Returning User Flow

**Steps:**
1. Complete Scenario 1 fully
2. Refresh the page (without clearing storage)

**Expected Behavior:**
- ✅ User guide shows simplified version
- ✅ Redux: `app.isFirstTimeUser` = `false`
- ✅ Only fullscreen button visible (no lengthy instructions)
- ✅ Click fullscreen → Guide completes immediately
- ✅ Ad Popup appears
- ✅ After Ad closes, normal browsing

### Scenario 4: Scroll Behavior Testing

**Detailed Scroll Tests:**

1. **Mouse Wheel:**
   - ✅ Scroll down with mouse wheel
   - ✅ Should stop at second video
   - ✅ Cannot scroll beyond

2. **Touch Swipe (Mobile/Touchpad):**
   - ✅ Swipe up (scroll down)
   - ✅ Should stop at second video
   - ✅ Cannot swipe beyond

3. **Keyboard Navigation:**
   - ✅ Press Down arrow / Page Down
   - ✅ Should stop at second video

4. **After Ad Closes:**
   - ✅ All scroll methods should work normally
   - ✅ No restrictions

## Redux State Monitoring

### Using Redux DevTools

Install Redux DevTools Extension, then monitor:

```javascript
// Initial State (Guide Active)
scrollRestriction: {
  isRestricted: true,
  hasReachedSecondVideo: false,
  maxScrollIndex: 1
}

// After Reaching Second Video
scrollRestriction: {
  isRestricted: true,
  hasReachedSecondVideo: true,
  maxScrollIndex: 1
}

// After Ad Popup Closes
scrollRestriction: {
  isRestricted: false,
  hasReachedSecondVideo: true,
  maxScrollIndex: 1
}
```

### Manual Redux Check (Console)

```javascript
// Check scroll restriction state
window.__REDUX_DEVTOOLS_EXTENSION__.store.getState().scrollRestriction

// Check app state
window.__REDUX_DEVTOOLS_EXTENSION__.store.getState().app
```

## DOM Inspection

### Check Rendered Videos

**During Restriction:**
```javascript
// Should return 2 videos max
document.querySelectorAll('.app__videos .video').length
```

**After Restriction Removed:**
```javascript
// Should return all videos (will increase as you scroll)
document.querySelectorAll('.app__videos .video').length
```

### Check IntersectionObserver

Open console and look for IntersectionObserver entries:
```
ImmersiveUserGuide: Component mounted
ImmersiveUserGuide: Video index changed: 0
ImmersiveUserGuide: Video index changed: 1
ImmersiveUserGuide: Reached second video, showing Ad Popup
```

## Common Issues & Solutions

### Issue 1: Ad Popup Doesn't Appear
**Symptoms:** Scroll to second video but Ad doesn't show

**Solutions:**
- Check Redux: Is `scrollRestriction.hasReachedSecondVideo` true?
- Check console for errors
- Verify IntersectionObserver is working
- Clear cache and reload

### Issue 2: Can't Scroll at All
**Symptoms:** Videos won't scroll even to second video

**Solutions:**
- Check if there are at least 2 videos loaded
- Verify `getRestrictedVideos()` is returning 2 videos
- Check console for JavaScript errors
- Verify `maxScrollIndex` is set to 1 (not 0)

### Issue 3: Scroll Restriction Not Removed
**Symptoms:** After Ad closes, still can't scroll past second video

**Solutions:**
- Check Redux: Is `scrollRestriction.isRestricted` false after Ad closes?
- Verify `disableScrollRestriction()` is called in PopupLayer
- Check browser console for errors
- Refresh page and try again

### Issue 4: User Guide Doesn't Show
**Symptoms:** Page loads but no user guide

**Solutions:**
- Clear browser storage completely
- Check Redux: Is `app.showUserGuide` true?
- Verify you're on the home page (/)
- Check if there's an active event (events take precedence)

## Performance Testing

### Metrics to Monitor

1. **Render Performance:**
   - Open Performance tab in DevTools
   - Record while scrolling
   - Check for:
     - Smooth 60fps scrolling
     - No jank when restriction activates
     - Quick re-render when restriction removed

2. **Memory Usage:**
   - Open Memory tab
   - Take heap snapshot before and after Ad closes
   - Verify no memory leaks from observers

3. **Network:**
   - Check Network tab
   - Videos should load progressively
   - No unnecessary refetches

## Automated Testing (Future)

### Unit Tests (Jest)

```typescript
describe('scrollRestrictionSlice', () => {
  it('should enable restriction', () => {
    // Test enableScrollRestriction action
  });
  
  it('should disable restriction', () => {
    // Test disableScrollRestriction action
  });
});

describe('ImmersiveUserGuide', () => {
  it('should render for first-time users', () => {
    // Test component rendering
  });
  
  it('should track video index changes', () => {
    // Test IntersectionObserver logic
  });
});

describe('Home Component', () => {
  it('should restrict videos during guide', () => {
    // Test getRestrictedVideos function
  });
});
```

### E2E Tests (Playwright/Cypress)

```typescript
test('scroll restriction flow', async ({ page }) => {
  // Clear storage
  await page.context().clearCookies();
  
  // Navigate to app
  await page.goto('http://localhost:5173/');
  
  // Wait for user guide
  await page.waitForSelector('.immersive-user-guide');
  
  // Try scrolling
  await page.mouse.wheel(0, 1000);
  
  // Verify can't scroll past second video
  const videos = await page.$$('.video');
  expect(videos.length).toBeLessThanOrEqual(2);
  
  // Scroll to second video
  await page.evaluate(() => {
    document.querySelectorAll('.video')[1].scrollIntoView();
  });
  
  // Wait for Ad Popup
  await page.waitForSelector('.popup-overlay');
  
  // Close Ad
  await page.click('.close-button');
  
  // Verify unrestricted scrolling
  await page.mouse.wheel(0, 2000);
  const allVideos = await page.$$('.video');
  expect(allVideos.length).toBeGreaterThan(2);
});
```

## Browser Compatibility Testing

Test on:
- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari (Desktop & Mobile)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through buttons
   - Press Enter/Space to activate
   - Arrow keys to scroll

2. **Screen Reader:**
   - Check ARIA labels
   - Verify announcements

3. **Reduced Motion:**
   - Test with `prefers-reduced-motion: reduce`
   - Animations should be subtle or disabled

## Sign-off Checklist

Before marking as production-ready:

- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Redux state updates correctly
- [ ] Performance is acceptable (60fps)
- [ ] No memory leaks
- [ ] Works on all browsers
- [ ] Mobile responsive
- [ ] Accessible
- [ ] Code reviewed
- [ ] Documentation updated

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors
5. Redux state snapshot
6. Screenshots/video

---

**Last Updated:** November 28, 2025  
**Testing Status:** Ready for Manual Testing  
**Priority:** High (New Feature)

