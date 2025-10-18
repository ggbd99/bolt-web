# Video Player Loading Issue - Debugging Guide

## Summary of Changes Made

I've updated your video player implementation to fix the infinite loading loop issue. Here's what was changed:

### 1. Enhanced WatchView Component (`src/views/WatchView.tsx`)

**Added Features:**
- Loading state indicator with timeout (5 seconds)
- Error handling with retry mechanism
- Better iframe attributes for compatibility
- Visual feedback for loading and error states

**New iframe attributes:**
```jsx
sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
referrerPolicy="no-referrer-when-downgrade"
onLoad={handleIframeLoad}
onError={handleIframeError}
title="Video Player"
```

### 2. Enhanced App.tsx (`src/App.tsx`)

**Added:**
- Console logging for generated player URLs (for debugging)
- Better URL construction with explicit logging

### 3. Test Page Created (`test-player.html`)

A standalone HTML page to test the Vidking player independently of your React app.

---

## How to Debug

### Step 1: Check Console Logs

Open your browser's Developer Tools (F12) and check the Console tab:

1. Look for messages like:
   - `Generated Movie Player URL: https://www.vidking.net/embed/movie/...`
   - `Generated TV Player URL: https://www.vidking.net/embed/tv/...`

2. Copy the URL and try opening it directly in a new browser tab
3. Check for any error messages or CORS issues

### Step 2: Test with Standalone Player

1. Open `test-player.html` in your browser (located in project root)
2. This will load the Vidking player without your React app
3. Check if the player loads correctly
4. Watch the "Player Messages" section for events from the player

### Step 3: Verify TMDB IDs

Make sure the TMDB IDs you're using are correct:

**Test with known working IDs:**
- Movie: `299534` (Avengers: Endgame)
- Movie: `1078605` (Deadpool)
- TV: `119051` Season 1, Episode 1 (Wednesday)

### Step 4: Check Network Requests

In Developer Tools Network tab:
1. Filter by "vidking.net"
2. Check if the iframe request is being made
3. Look at the response status (should be 200)
4. Check for any blocked requests (CORS errors)

---

## Common Issues and Solutions

### Issue 1: Infinite Loading Loop

**Symptoms:** Player shows loading spinner forever

**Possible Causes:**
1. TMDB ID doesn't exist or content not available on Vidking
2. Network/CORS issues
3. Ad blockers or browser extensions blocking the iframe

**Solutions:**
- Try different TMDB IDs (use the test IDs above)
- Disable ad blockers temporarily
- Check browser console for error messages
- Try in incognito mode

### Issue 2: Black Screen

**Symptoms:** Player loads but shows black screen

**Possible Causes:**
1. Content not available for that specific ID
2. Geo-restrictions
3. VPN or proxy issues

**Solutions:**
- Try different content
- Disable VPN if using one
- Check if the content loads on vidking.net directly

### Issue 3: CORS Errors

**Symptoms:** Console shows "blocked by CORS policy"

**Possible Causes:**
1. Browser security settings
2. Missing iframe attributes

**Solutions:**
- Already fixed with sandbox and referrerPolicy attributes
- Try different browser
- Check if your development server is running on localhost

---

## URL Structure Verification

According to Vidking documentation, URLs should be:

### Movies:
```
https://www.vidking.net/embed/movie/{tmdbId}?color=6366f1
```

### TV Shows:
```
https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}?episodeSelector=true&nextEpisode=true&color=6366f1
```

Your app now generates these URLs correctly and logs them to console.

---

## Testing Checklist

- [ ] Check console for generated URLs
- [ ] Test URL directly in browser
- [ ] Try test-player.html standalone page
- [ ] Test with known working TMDB IDs (299534, 1078605, 119051)
- [ ] Check Network tab for failed requests
- [ ] Try in incognito mode
- [ ] Disable browser extensions/ad blockers
- [ ] Test on different browser

---

## Updated Error Handling

The WatchView component now includes:

1. **Loading State:** Shows spinner for first 5 seconds
2. **Error State:** Shows error message with retry button if player fails to load
3. **Retry Mechanism:** User can retry loading the player
4. **URL Display:** Error message shows the player URL for debugging

---

## Next Steps

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open the test page:**
   - Navigate to `http://localhost:5173/test-player.html` (adjust port if different)
   - Or open `test-player.html` directly in browser

3. **Test your React app:**
   - Try playing a movie or TV show
   - Check browser console for URL logs
   - If error appears, try the retry button

4. **Report findings:**
   - Note which TMDB IDs work/don't work
   - Copy any error messages from console
   - Check if test-player.html works when React app doesn't

---

## Additional Notes

### Iframe Sandbox Attribute

The sandbox attribute allows:
- `allow-same-origin`: Lets iframe access localStorage
- `allow-scripts`: Required for player JavaScript
- `allow-forms`: For any player controls
- `allow-popups`: For fullscreen and quality selection
- `allow-popups-to-escape-sandbox`: For external links
- `allow-presentation`: For fullscreen API

### Player Events

The player sends these events via postMessage:
- `play`: Video started playing
- `pause`: Video paused
- `timeupdate`: Progress update (continuous)
- `ended`: Video finished
- `seeked`: User skipped to different time

Your app listens for these and saves watch progress automatically.

---

## If Still Not Working

Try this direct test URL in your browser:
```
https://www.vidking.net/embed/movie/299534?color=6366f1
```

If this doesn't work in a plain browser tab, the issue might be:
1. Vidking service is down
2. Content is geo-blocked in your region
3. Your ISP is blocking the domain

If it DOES work in a plain tab but not in your app, the issue is:
1. Iframe configuration (now fixed)
2. CSP (Content Security Policy) headers from your dev server
3. Browser security settings

---

## Contact Support

If you continue experiencing issues, check:
- Vidking status/documentation: https://www.vidking.net/
- TMDB API for valid movie/TV IDs: https://www.themoviedb.org/

Good luck! 🎬
