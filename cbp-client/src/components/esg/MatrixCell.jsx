import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import UserAddLineIcon from 'remixicon-react/UserAddLineIcon';
import UserAvatar from './UserAvatar';
import { getAssignmentsForSiteMetric, getUserById } from '../../lib/esgMockData';

/**
 * MatrixCell - Individual cell in the assignment matrix
 * Displays user count or empty state, clickable to open assignment modal
 */
const MatrixCell = ({ siteId, metricId, userCount, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isEmpty = userCount === 0;

  // Get assigned users for this cell
  const assignedUsers = useMemo(() => {
    if (isEmpty) return [];
    const assignments = getAssignmentsForSiteMetric(siteId, metricId);
    return assignments
      .map(assignment => getUserById(assignment.userId))
      .filter(Boolean); // Remove any null/undefined users
  }, [siteId, metricId, isEmpty]);

  // Max avatars to show before "+N"
  const MAX_VISIBLE_AVATARS = 3;
  const visibleUsers = assignedUsers.slice(0, MAX_VISIBLE_AVATARS);
  const remainingCount = assignedUsers.length - MAX_VISIBLE_AVATARS;

  // Generate tooltip text with all user names
  const tooltipText = useMemo(() => {
    if (isEmpty) return 'Click to assign users';
    const names = assignedUsers.map(u => u.name).join(', ');
    return `Assigned: ${names}`;
  }, [assignedUsers, isEmpty]);

  const handleClick = () => {
    if (onClick) {
      onClick(siteId, metricId);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer transition-all"
      title={tooltipText}
      style={{
        minWidth: '120px',
        height: '60px',
        padding: '12px',
        borderRadius: '6px',
        border: isEmpty 
          ? (isHovered ? '1px solid #073370' : '1px dashed rgba(229, 229, 229, 1)')
          : (isHovered ? '1px solid #073370' : '1px solid rgba(229, 229, 229, 1)'),
        backgroundColor: isEmpty 
          ? (isHovered ? 'rgba(7, 51, 112, 0.02)' : 'transparent')
          : (isHovered ? 'rgba(7, 51, 112, 0.08)' : 'rgba(7, 51, 112, 0.05)'),
        boxShadow: isHovered ? '0px 2px 8px 0px rgba(0, 0, 0, 0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      }}
    >
      {isEmpty ? (
        <>
          {/* User-plus icon always visible, low opacity by default, full on hover */}
          <UserAddLineIcon 
            style={{ 
              width: '28px', 
              height: '28px', 
              color: '#073370',
              opacity: isHovered ? 1.0 : 0.25,
              transition: 'opacity 0.2s ease'
            }} 
          />
        </>
      ) : (
        <>
          {/* Show user avatars */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flexWrap: 'wrap',
              padding: '4px'
            }}
          >
            {visibleUsers.map(user => (
              <UserAvatar key={user.id} user={user} size="small" />
            ))}
            
            {/* Show +N indicator if there are more users */}
            {remainingCount > 0 && (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(7, 51, 112, 0.1)',
                  color: '#073370',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                  border: '2px solid white',
                  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
                }}
              >
                +{remainingCount}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

MatrixCell.propTypes = {
  siteId: PropTypes.string.isRequired,
  metricId: PropTypes.string.isRequired,
  userCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default MatrixCell;


