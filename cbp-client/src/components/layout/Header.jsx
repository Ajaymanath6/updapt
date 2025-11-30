import { useLocation } from 'react-router-dom';
import Notification3LineIcon from 'remixicon-react/Notification3LineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import UserLineIcon from 'remixicon-react/UserLineIcon';

/**
 * Header - Top navigation bar with search and user profile
 */
const Header = () => {
  const location = useLocation();
  const showSearch = location.pathname !== '/auctions';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:px-6 justify-between">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1" style={{ maxWidth: '312px' }}>
          <div className="relative">
            <SearchLineIcon 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
              style={{ width: '20px', height: '20px' }}
            />
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                borderRadius: '4px',
                height: '36px',
                paddingTop: '6px',
                paddingBottom: '6px',
                paddingLeft: '32px',
                paddingRight: '8px',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.03em',
                fontWeight: 400
              }}
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
          <Notification3LineIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#073370' }}>
            <UserLineIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

