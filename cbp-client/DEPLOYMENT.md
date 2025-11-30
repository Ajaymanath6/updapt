# Deployment Guide - GitLab Pages

This guide will help you deploy the Cubictree Banking Platform frontend to GitLab Pages.

## 🎯 Pre-Deployment Checklist

- ✅ Filter badge counter added
- ✅ All checkboxes use brand color
- ✅ Pagination aligned properly
- ✅ Vite config updated with correct base path
- ✅ GitLab CI/CD configuration created
- ✅ Build tested locally (works correctly)
- ✅ Code splitting implemented
- ✅ .nojekyll file added

## 🚀 Deployment Steps

### Step 1: Initialize Git Repository

```bash
cd /home/mis/cubic\ tree/cbp-client

# Initialize git repository
git init --initial-branch=main

# Configure git user
git config --local user.name "Ajay Manath"
git config --local user.email "ajaymanath96@gmail.com"
```

### Step 2: Add GitLab Remote

```bash
# Add GitLab as remote origin
git remote add origin git@gitlab.com:mandal-minds/cubictree.git

# Verify remote
git remote -v
```

### Step 3: Commit All Files

```bash
# Add all files
git add .

# Commit with meaningful message
git commit -m "feat: Initial commit - Cubictree Banking Platform Frontend

- Dashboard with KPI cards and period filters
- Auctions page with filters, search, and pagination
- Ad Publishing page with tab navigation
- Responsive design for all screen sizes
- Filter badge counter implementation
- GitLab Pages deployment configuration
- Code splitting and performance optimizations"
```

### Step 4: Push to GitLab

```bash
# Push to GitLab
git push --set-upstream origin main
```

## 🔧 GitLab Pages Configuration

### Enable GitLab Pages

1. Go to your GitLab project: https://gitlab.com/mandal-minds/cubictree
2. Navigate to **Settings** > **Pages**
3. GitLab Pages will be automatically enabled after the first pipeline runs
4. Your site will be available at: `https://mandal-minds.gitlab.io/cubictree/`

### CI/CD Pipeline

The `.gitlab-ci.yml` file is configured to:

1. **Build Stage**:
   - Install dependencies
   - Build production version
   - Create optimized assets
   - Cache node_modules for faster subsequent builds

2. **Deploy Stage**:
   - Copy build files to `public` folder
   - Add `.nojekyll` file (prevents Jekyll processing)
   - Deploy to GitLab Pages

## 📊 What Happens After Push

1. Code is pushed to GitLab
2. GitLab CI/CD pipeline automatically triggers
3. Build job runs (installs deps, builds project)
4. If build succeeds, deploy job runs
5. Files are published to GitLab Pages
6. Site becomes available at the Pages URL

### Monitor Pipeline

1. Go to **CI/CD** > **Pipelines** in your GitLab project
2. Click on the latest pipeline to see progress
3. View logs for each job (build, deploy)
4. Check for any errors

## 🚨 Preventing White Screen Issues

The following measures are in place to prevent blank/white screen:

### 1. Correct Base Path
```javascript
// vite.config.js
base: process.env.NODE_ENV === 'production' ? '/cubictree/' : '/'
```

### 2. Code Splitting
```javascript
// Separate chunks for better loading
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom', 'react-router-dom'],
      charts: ['recharts'],
    },
  },
}
```

### 3. .nojekyll File
Prevents GitLab from processing files with Jekyll (which can break React apps).

### 4. Router Configuration
React Router is configured to handle the base path correctly.

## 🧪 Testing Deployment

### Local Testing with Production Build

```bash
# Build with production settings
NODE_ENV=production npm run build

# Preview the build
npm run preview
```

Then navigate to the preview URL and verify:
- ✅ All pages load correctly
- ✅ Images display properly
- ✅ Routing works
- ✅ Styles are applied
- ✅ No console errors

### After Deployment

Visit: `https://mandal-minds.gitlab.io/cubictree/`

Check:
- ✅ Homepage loads without white screen
- ✅ Navigation works (Dashboard, Auctions, Ads)
- ✅ Images load correctly
- ✅ Filters work
- ✅ Pagination functions properly
- ✅ Responsive design on mobile/tablet

## 🔍 Troubleshooting

### Issue: White/Blank Screen

**Solution**:
1. Check browser console for errors
2. Verify base path in vite.config.js matches repo name
3. Ensure all asset paths are relative
4. Check if .nojekyll file exists

### Issue: 404 for Assets

**Solution**:
1. Verify build output in `dist` folder
2. Check base path configuration
3. Ensure GitLab Pages is enabled
4. Wait for pipeline to complete

### Issue: Pipeline Fails

**Solution**:
1. Check pipeline logs in GitLab
2. Verify .gitlab-ci.yml syntax
3. Check if node_modules cache is corrupt (clear it)
4. Ensure all dependencies are in package.json

### Issue: Routing Doesn't Work

**Solution**:
1. React Router should handle client-side routing
2. Verify BrowserRouter is configured correctly
3. Check if 404.html fallback is needed (usually not with SPA)

## 📈 Performance Metrics

After deployment, check performance:

### Before Optimization:
- Single bundle: 622 KB
- Load time: ~3-4 seconds

### After Optimization:
- Vendor chunk: 44.94 KB
- Charts chunk: 324.17 KB
- Main chunk: 252.80 KB
- Total: ~622 KB (but loads in parallel, faster perceived load)
- Estimated load time: ~1-2 seconds

## 🔄 Continuous Deployment

Every push to `main` branch will:
1. Trigger automatic build
2. Run tests (if configured)
3. Deploy to GitLab Pages
4. Update live site

### Manual Deployment

If you need to redeploy without code changes:
1. Go to **CI/CD** > **Pipelines**
2. Click **Run Pipeline**
3. Select `main` branch
4. Click **Run Pipeline** button

## 📝 Post-Deployment Tasks

After successful deployment:

1. ✅ Test all features on live site
2. ✅ Verify responsive design
3. ✅ Check all images load
4. ✅ Test filters and pagination
5. ✅ Verify search functionality
6. ✅ Check browser compatibility (Chrome, Firefox, Safari, Edge)
7. ✅ Test on different devices (Desktop, Tablet, Mobile)
8. ✅ Share URL with team for review

## 🎉 Success Criteria

Deployment is successful when:
- ✅ No white/blank screen
- ✅ All pages accessible
- ✅ Filters work correctly with badge counter
- ✅ Pagination navigates properly
- ✅ Images display correctly
- ✅ No console errors
- ✅ Responsive on all devices
- ✅ Fast load times (<3 seconds)

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review GitLab CI/CD logs
3. Check browser console
4. Verify all configuration files
5. Test locally with production build

---

**Good Luck with Your Deployment! 🚀**

For questions or issues, contact the development team.



