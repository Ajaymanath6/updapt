import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { esgMockData, getUserById, getSiteById, getMetricById, getAssignmentsForSiteMetric, createAssignment, removeAssignment } from '../../lib/esgMockData';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import UserLineIcon from 'remixicon-react/UserLineIcon';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

/**
 * UserAssignmentModal - Modal for assigning users to site-metric combinations
 * Shows searchable user list with checkbox selection
 */
const UserAssignmentModal = ({ isOpen, onClose, siteIds, metricIds, onAssignmentChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [initialAssignments, setInitialAssignments] = useState([]);
  const { showSuccess, showError, showInfo } = useToast();

  // Get site and metric names for display
  const sites = useMemo(() => siteIds.map(id => getSiteById(id)).filter(Boolean), [siteIds]);
  const metrics = useMemo(() => metricIds.map(id => getMetricById(id)).filter(Boolean), [metricIds]);

  // Load existing assignments when modal opens
  useEffect(() => {
    if (isOpen && siteIds.length > 0 && metricIds.length > 0) {
      // For simplicity, we'll check the first site-metric combination
      // In a real app, you might want to show a union or intersection of all combinations
      const assignments = getAssignmentsForSiteMetric(siteIds[0], metricIds[0]);
      const assignedUserIds = assignments.map(a => a.userId);
      setSelectedUsers(assignedUserIds);
      setInitialAssignments(assignedUserIds);
    }
  }, [isOpen, siteIds, metricIds]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return esgMockData.users;
    const term = searchTerm.toLowerCase();
    return esgMockData.users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Toggle user selection
  const toggleUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Select all filtered users
  const selectAll = () => {
    const allFilteredUserIds = filteredUsers.map(u => u.id);
    setSelectedUsers(prev => {
      const newSet = new Set([...prev, ...allFilteredUserIds]);
      return Array.from(newSet);
    });
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedUsers([]);
  };

  // Handle save
  const handleSave = () => {
    try {
      // Determine which users to add and which to remove
      const usersToAdd = selectedUsers.filter(userId => !initialAssignments.includes(userId));
      const usersToRemove = initialAssignments.filter(userId => !selectedUsers.includes(userId));

      let addedCount = 0;
      let removedCount = 0;

      // Apply changes to all site-metric combinations
      siteIds.forEach(siteId => {
        metricIds.forEach(metricId => {
          // Add new assignments
          usersToAdd.forEach(userId => {
            const result = createAssignment(userId, siteId, metricId);
            if (result) addedCount++;
          });

          // Remove assignments
          usersToRemove.forEach(userId => {
            const assignments = getAssignmentsForSiteMetric(siteId, metricId);
            const assignmentToRemove = assignments.find(a => a.userId === userId);
            if (assignmentToRemove) {
              const result = removeAssignment(assignmentToRemove.id);
              if (result) removedCount++;
            }
          });
        });
      });

      // Show success message
      const totalChanges = addedCount + removedCount;
      if (totalChanges > 0) {
        showSuccess(`Successfully updated ${totalChanges} assignment${totalChanges !== 1 ? 's' : ''} (${addedCount} added, ${removedCount} removed)`);
      } else {
        showInfo('No changes were made');
      }

      // Notify parent component
      if (onAssignmentChange) {
        onAssignmentChange();
      }

      // Close modal
      handleClose();
    } catch (error) {
      showError('Failed to save assignments. Please try again.');
      console.error('Error saving assignments:', error);
    }
  };

  // Handle close
  const handleClose = () => {
    setSearchTerm('');
    setSelectedUsers([]);
    setInitialAssignments([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="bg-white rounded-lg"
          style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            borderRadius: '12px',
            boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(229, 229, 229, 1)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1, paddingRight: '16px' }}>
              <h2 
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '28px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(26, 26, 26, 1)',
                  marginBottom: '8px'
                }}
              >
                Assign Users
              </h2>
              <div 
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)'
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>Sites:</span> {sites.map(s => s.name).join(', ')}
                </div>
                <div>
                  <span style={{ fontWeight: 500 }}>Metrics:</span> {metrics.map(m => m.name).join(', ')}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'rgba(87, 87, 87, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(229, 229, 229, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <CloseLineIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Search and Actions */}
          <div 
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(229, 229, 229, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Search */}
            <div className="relative">
              <SearchLineIcon 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
              />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full focus:outline-none focus:ring-2"
                style={{
                  borderRadius: '6px',
                  height: '40px',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  backgroundColor: 'rgba(249, 249, 249, 1)',
                  border: '1px solid rgba(229, 229, 229, 1)',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.03em'
                }}
              />
            </div>

            {/* Selection info and actions */}
            <div className="flex items-center justify-between">
              <div 
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(26, 26, 26, 1)'
                }}
              >
                {selectedUsers.length} of {esgMockData.users.length} users selected
              </div>
              <div className="flex" style={{ gap: '8px' }}>
                <button
                  onClick={selectAll}
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#073370',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '4px 8px'
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#073370',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '4px 8px'
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* User List */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0'
            }}
          >
            {filteredUsers.map(user => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className="cursor-pointer hover:bg-gray-50"
                  style={{
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid rgba(245, 245, 245, 1)'
                  }}
                >
                  {/* Checkbox */}
                  <div 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: '2px solid ' + (isSelected ? '#073370' : 'rgba(229, 229, 229, 1)'),
                      backgroundColor: isSelected ? '#073370' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && (
                      <CheckLineIcon style={{ width: '14px', height: '14px', color: 'white' }} />
                    )}
                  </div>

                  {/* User icon */}
                  <div 
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(7, 51, 112, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <UserLineIcon style={{ width: '20px', height: '20px', color: '#073370' }} />
                  </div>

                  {/* User info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div 
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        letterSpacing: '-0.03em',
                        color: 'rgba(26, 26, 26, 1)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.name}
                    </div>
                    <div 
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        color: 'rgba(87, 87, 87, 1)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredUsers.length === 0 && (
              <div 
                style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: 'rgba(87, 87, 87, 1)',
                  fontSize: '14px'
                }}
              >
                No users found matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div 
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(229, 229, 229, 1)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Assignments
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

UserAssignmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  siteIds: PropTypes.array.isRequired,
  metricIds: PropTypes.array.isRequired,
  onAssignmentChange: PropTypes.func,
};

export default UserAssignmentModal;

