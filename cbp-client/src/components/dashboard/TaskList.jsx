import PropTypes from 'prop-types';
import { Card } from '../common';
import ErrorWarningLineIcon from 'remixicon-react/ErrorWarningLineIcon';
import CheckboxCircleLineIcon from 'remixicon-react/CheckboxCircleLineIcon';
import Notification4LineIcon from 'remixicon-react/Notification4LineIcon';
import FullscreenLineIcon from 'remixicon-react/FullscreenLineIcon';
import AuctionLineIcon from 'remixicon-react/AuctionLineIcon';
import StackLineIcon from 'remixicon-react/StackLineIcon';

/**
 * TaskList - Display a list of tasks or alerts
 * @param {Object} props
 * @param {string} props.title - The title of the task list
 * @param {Array} props.items - Array of task items
 */
const TaskList = ({ title, items }) => {
  // Megaphone icon (same as sidebar Ad Publishing)
  const MegaphoneSVG = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M9 17C9 17 16 18 19 21H20C20.5523 21 21 20.5523 21 20V13.937C21.8626 13.715 22.5 12.9319 22.5 12C22.5 11.0681 21.8626 10.285 21 10.063V4C21 3.44772 20.5523 3 20 3H19C16 6 9 7 9 7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H6L7 22H9V17ZM11 8.6612C11.6833 8.5146 12.5275 8.31193 13.4393 8.04373C15.1175 7.55014 17.25 6.77262 19 5.57458V18.4254C17.25 17.2274 15.1175 16.4499 13.4393 15.9563C12.5275 15.6881 11.6833 15.4854 11 15.3388V8.6612ZM5 9H9V15H5V9Z"/>
    </svg>
  );
  
  // Determine icon based on task content
  const getIconForTask = (item) => {
    if (item.text.toLowerCase().includes('ad')) {
      return MegaphoneSVG;
    } else if (item.text.toLowerCase().includes('auction') || item.text.toLowerCase().includes('bid')) {
      return AuctionLineIcon;
    } else if (item.text.toLowerCase().includes('asset')) {
      return StackLineIcon;
    } else {
      return MegaphoneSVG;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      style={{
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Notification4LineIcon style={{ width: '20px', height: '20px', color: '#073370' }} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <FullscreenLineIcon style={{ width: '20px', height: '20px', color: '#073370' }} />
      </div>

      {/* Task Items */}
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No tasks at the moment</p>
          </div>
        ) : (
          items.map((item) => {
            const ItemIcon = getIconForTask(item);
            return (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3"
              >
                <ItemIcon 
                  className="flex-shrink-0 mt-0.5" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    color: '#575757' 
                  }} 
                />
                <div className="flex-1">
                  <p style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '1.2',
                    letterSpacing: '-0.04em',
                    color: '#1A1A1A'
                  }}>
                    {item.text}
                  </p>
                </div>
                {item.time && (
                  <p className="text-xs text-gray-500 flex-shrink-0">{item.time}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      alert: PropTypes.bool,
      time: PropTypes.string,
    })
  ).isRequired,
};

export default TaskList;

