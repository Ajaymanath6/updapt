# Cubictree Banking Platform - Frontend

A professional B2B web application for managing digital asset auctions and ad publishing.

## 🚀 Features

- **Dashboard**: Real-time KPIs and metrics with period filters (Day, Week, Month)
- **Auctions Management**: Comprehensive auction listing with filters, search, and pagination
- **Ad Publishing**: Campaign management with status tracking and image handling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with consistent brand colors

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3** - Styling
- **React Router DOM 7** - Routing
- **Recharts 3** - Data visualization
- **Remix Icons** - Icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

This project is configured for GitLab Pages deployment.

### Automatic Deployment

Push to `main` or `master` branch triggers automatic deployment via GitLab CI/CD.

### Manual Deployment

```bash
# Build production version
NODE_ENV=production npm run build

# The build output will be in the 'dist' folder
```

### GitLab Pages URL Structure

The app will be available at: `https://[namespace].gitlab.io/cubictree/`

## 🎨 Brand Colors

- **Primary CTA**: `#073370` (Navy Blue)
- **Backgrounds**: 
  - Sidebar: `rgba(249, 249, 249, 1)`
  - Main: `rgba(255, 255, 255, 1)`
- **Borders**: `rgba(229, 229, 229, 1)`
- **Text**: 
  - Primary: `rgba(26, 26, 26, 1)`
  - Secondary: `rgba(87, 87, 87, 1)`

## 📊 Project Structure

```
cbp-client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Buttons, Cards, etc.
│   │   ├── layout/      # Header, Sidebar
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── auctions/    # Auction components
│   │   └── ads/         # Ad publishing components
│   ├── pages/           # Page components
│   ├── lib/             # Mock data and utilities
│   ├── layouts/         # Layout wrappers
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .gitlab-ci.yml       # CI/CD configuration
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` is configured for GitLab Pages with:
- Correct base path for production
- Code splitting for optimized loading
- Separate chunks for vendor libraries and charts

### GitLab CI/CD

The `.gitlab-ci.yml` includes:
- Automated builds on push
- Dependency caching for faster builds
- GitLab Pages deployment
- Environment-specific configurations

## 📱 Features Breakdown

### Dashboard
- 4 KPI cards with period filters (Day, Week, Month)
- Auction activity chart (Bar chart)
- Recent alerts and tasks list
- Quick stats with date ranges

### Auctions
- Comprehensive table with 34+ mock entries
- Multi-filter system (Active, Processing, Cancelled, On Hold)
- Search by ID or asset name
- Full pagination (10, 20, 50, 100 items per page)
- Checkbox selection with brand colors
- Sort indicators on columns

### Ad Publishing
- Modern tab navigation (All, Draft, Scheduled, Published)
- Card-based layout with 4 columns
- Status badges with icons
- Image handling with fallback placeholders
- Edit functionality

## 🎯 Key Improvements

### Performance
- Code splitting reduced main bundle from 622 KB to 252 KB
- Separate vendor (44 KB) and charts (324 KB) chunks
- Lazy loading and optimized builds

### UX
- Filter badge counter shows active filter count
- Smooth pagination with page navigation
- Responsive design for all screen sizes
- Hover effects and transitions
- Collapsible sidebar with state persistence

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus states and indicators

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build and check for errors
npm run build
```

## 📝 Development Notes

### Adding New Features
1. Create component in appropriate folder
2. Add to exports in index.js
3. Import and use in pages
4. Test responsive behavior
5. Check linter for errors

### Mock Data
Mock data is located in `src/lib/mockData.js`:
- 34 auction entries with various statuses
- 8 ad campaigns with images
- Dashboard KPIs with period-based values

### Styling Guidelines
- Use Tailwind utilities where possible
- Inline styles for precise specifications
- Consistent spacing (4px, 8px, 16px, 32px)
- Brand colors throughout

## 🚨 Troubleshooting

### White Screen After Deployment
- Ensure `base` path in `vite.config.js` matches GitLab repo name
- Check browser console for 404 errors
- Verify `.nojekyll` file exists in public folder

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for syntax errors in components

### Routing Issues
- Verify React Router is configured correctly
- Check base path in router matches Vite config
- Ensure all routes have proper paths

## 📄 License

© 2024 Cubictree Banking Platform. All rights reserved.

## 👥 Team

Developed by Mandal Minds for Cubictree Banking Platform.

## 🔗 Links

- **GitLab Repository**: https://gitlab.com/mandal-minds/cubictree
- **GitLab Pages**: https://mandal-minds.gitlab.io/cubictree/
- **Documentation**: [Internal Wiki]

---

**Version**: 1.3.0  
**Last Updated**: November 2, 2025  
**Status**: Production Ready ✅
