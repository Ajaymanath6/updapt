import Notification3LineIcon from 'remixicon-react/Notification3LineIcon';
import UserLineIcon from 'remixicon-react/UserLineIcon';

/**
 * Header - Top navigation bar with user profile
 */
const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:px-6 justify-between">
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

