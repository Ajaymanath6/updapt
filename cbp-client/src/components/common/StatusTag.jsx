import PropTypes from 'prop-types';

import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import TimeLineIcon from 'remixicon-react/TimeLineIcon';

/**
 * StatusTag component for displaying status indicators with color-coded styling
 * @param {Object} props
 * @param {string} props.status - Status value to display
 */
const StatusTag = ({ status }) => {
  const getStatusIndicator = () => {
    switch (status) {
      case 'Published':
        return <CheckLineIcon style={{ width: '14px', height: '14px' }} />;
      case 'Scheduled':
        return <TimeLineIcon style={{ width: '14px', height: '14px' }} />;
      case 'Active':
        return (
          <div 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(103, 170, 56, 1)'
            }}
          />
        );
      case 'Pending':
        return (
          <div 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(234, 179, 8, 1)' // Yellow
            }}
          />
        );
      case 'Closed':
        return (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M1 1L5 5M5 1L1 5" stroke="rgba(239, 68, 68, 1)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span 
      className="inline-flex items-center justify-center"
      style={{
        height: '24px',
        gap: '4px',
        borderRadius: '4px',
        borderWidth: '1px',
        paddingTop: '2px',
        paddingRight: '6px',
        paddingBottom: '2px',
        paddingLeft: '6px',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        border: '1px solid rgba(229, 229, 229, 1)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '-0.03em',
        textAlign: 'center',
        color: 'rgba(87, 87, 87, 1)',
        minWidth: '75px'
      }}
    >
      {getStatusIndicator()}
      {status}
    </span>
  );
};

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusTag;

