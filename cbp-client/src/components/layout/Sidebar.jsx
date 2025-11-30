import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Settings3LineIcon from 'remixicon-react/Settings3LineIcon';
import LayoutRightLineIcon from 'remixicon-react/LayoutRightLineIcon';
import LayoutLeftLineIcon from 'remixicon-react/LayoutLeftLineIcon';

/**
 * Sidebar - Collapsible navigation sidebar with user preference persistence
 */
const Sidebar = () => {
  // Load collapsed state from localStorage, default to false (expanded)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const navLinks = [
    { to: '/', icon: Settings3LineIcon, label: 'ESG Configuration' },
  ];

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-56'
      }`}
      style={{ 
        width: isCollapsed ? '80px' : '224px',
        backgroundColor: 'rgba(249, 249, 249, 1)',
        borderRight: '1px solid rgba(229, 229, 229, 1)'
      }}
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between px-4" style={{ height: '48px' }}>
        {!isCollapsed && (
          <div className="transition-opacity duration-200">
            <img 
              src="https://www.updapt.com/static/media/updapt-logo-green.f49fc6e4.png" 
              alt="Updapt Logo" 
              style={{ height: '32px', width: 'auto' }}
            />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <LayoutLeftLineIcon className="w-5 h-5" />
          ) : (
            <LayoutRightLineIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        {/* Workspace Heading */}
        {!isCollapsed && (
          <div className="px-2 mb-3">
            <h2 
              className="text-sm font-semibold text-gray-600"
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                fontWeight: 600
              }}
            >
              Workspace
            </h2>
          </div>
        )}
        
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} rounded-lg transition-all duration-200 relative group ${
                isActive
                  ? 'text-white'
                  : 'text-gray-600'
              }`
            }
            style={({ isActive }) => ({
              height: '40px',
              width: isCollapsed ? '48px' : 'auto',
              padding: isCollapsed ? '8px' : '8px 12px',
              borderLeft: isActive ? '2px solid #073370' : '2px solid transparent',
              backgroundColor: isActive ? '#073370' : 'transparent',
              display: 'flex',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              alignItems: 'center',
              margin: isCollapsed ? '0 auto' : '0'
            })}
            onMouseEnter={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(229, 229, 229, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            title={isCollapsed ? link.label : ''}
          >
            {({ isActive }) => (
              <>
                <link.icon 
                  className="flex-shrink-0"
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    color: isActive ? '#ffffff' : 'rgba(87, 87, 87, 1)'
                  }} 
                />
                {!isCollapsed && (
                  <span 
                    className="font-medium transition-opacity duration-200 text-sm"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    {link.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {link.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 transition-opacity duration-200">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Updapt
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

