# 🔍 Debugging White Screen on GitLab Pages

## Steps for User to Check:

### 1. Open Browser Console
1. Visit: https://mandal-minds.gitlab.io/cubictree/
2. Press `F12` (or right-click > Inspect)
3. Click on the **Console** tab
4. Look for red error messages

### Common Errors and What They Mean:

#### Error: "Failed to load module script"
- **Cause**: Assets are not loading from correct path
- **Fix**: Verify base path configuration

#### Error: "Unexpected token '<'"
- **Cause**: HTML being served instead of JavaScript
- **Fix**: Check 404 handling

#### Error: "Failed to fetch dynamically imported module"
- **Cause**: Asset paths incorrect
- **Fix**: Rebuild with correct base path

### 2. Check Network Tab
1. Click on **Network** tab in Developer Tools
2. Refresh the page (`Ctrl+R` or `Cmd+R`)
3. Look for files with red status codes (404)
4. Check if `/cubictree/assets/*.js` files are loading

### 3. Check What URL You're Visiting
- ✅ Correct: `https://mandal-minds.gitlab.io/cubictree/` (with trailing slash)
- ❌ Wrong: `https://mandal-minds.gitlab.io/cubictree` (without trailing slash)

### 4. Hard Refresh
1. Clear cache: `Ctrl+Shift+Delete` (Chrome) or `Cmd+Shift+Delete` (Mac)
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

### 5. Test in Incognito/Private Mode
- Open new incognito/private window
- Visit the site fresh (no cache)

## What to Tell Me:

Copy and paste any errors from the Console tab here, especially:
- Failed to load...
- 404 errors
- CORS errors
- Any red error messages

