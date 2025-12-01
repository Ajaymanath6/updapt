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
        backgroundColor: 'transparent',
        boxShadow: 'none',
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
          {/* Show user avatars - stacked/overlapping */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            {visibleUsers.map((user, index) => (
              <div
                key={user.id}
                style={{
                  marginLeft: index > 0 ? '-8px' : '0'
                }}
              >
                <UserAvatar user={user} size="small" />
              </div>
            ))}
            
            {/* Show +N indicator if there are more users */}
            {remainingCount > 0 && (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(249, 249, 249, 1)',
                  color: 'rgba(87, 87, 87, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 500,
                  flexShrink: 0,
                  marginLeft: visibleUsers.length > 0 ? '-8px' : '0',
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


