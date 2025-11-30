import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserById, getSiteById, getMetricById, removeAssignment, esgMockData, updateAssignment } from '../../lib/esgMockData';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import AlertLineIcon from 'remixicon-react/AlertLineIcon';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

/**
 * EditAssignmentModal - Modal for editing or removing a single assignment
 * Smaller focused modal with confirmation for remove action
 */
const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentChange }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [selectedMetricId, setSelectedMetricId] = useState('');
  const { showSuccess, showError } = useToast();

  // Initialize edit form when assignment changes
  useEffect(() => {
    if (assignment) {
      setSelectedSiteId(assignment.siteId);
      setSelectedMetricId(assignment.metricId);
      setIsEditing(false);
      setShowConfirmation(false);
    }
  }, [assignment]);

  if (!isOpen || !assignment) return null;

  const user = getUserById(assignment.userId);
  const site = getSiteById(assignment.siteId);
  const metric = getMetricById(assignment.metricId);

  // Check if changes were made
  const hasChanges = selectedSiteId !== assignment.siteId || selectedMetricId !== assignment.metricId;

  // Handle save edit
  const handleSaveEdit = () => {
    try {
      // For now, we'll simulate updating by removing old and creating new
      // In a real app, you'd have an updateAssignment function
      const oldSite = getSiteById(assignment.siteId);
      const oldMetric = getMetricById(assignment.metricId);
      const newSite = getSiteById(selectedSiteId);
      const newMetric = getMetricById(selectedMetricId);
      
      // Log the change (audit log simulation)
      console.log('AUDIT LOG: Assignment edited', {
        user: user?.name,
        from: `${oldSite?.name} → ${oldMetric?.name}`,
        to: `${newSite?.name} → ${newMetric?.name}`,
        timestamp: new Date().toISOString()
      });
      
      // Update the assignment
      assignment.siteId = selectedSiteId;
      assignment.metricId = selectedMetricId;
      
      showSuccess(`Assignment updated: ${user?.name} → ${newSite?.name} → ${newMetric?.name}`);
      
      // Notify parent component
      if (onAssignmentChange) {
        onAssignmentChange();
      }
      
      // Close modal
      handleClose();
    } catch (error) {
      showError('Failed to update assignment. Please try again.');
      console.error('Error updating assignment:', error);
    }
  };

  // Handle remove
  const handleRemove = () => {
    try {
      const result = removeAssignment(assignment.id);
      
      if (result) {
        // Log the deletion (audit log simulation)
        console.log('AUDIT LOG: Assignment deleted', {
          user: user?.name,
          site: site?.name,
          metric: metric?.name,
          timestamp: new Date().toISOString()
        });
        
        showSuccess('Assignment removed successfully');
      } else {
        showError('Failed to remove assignment');
      }
      
      // Notify parent component
      if (onAssignmentChange) {
        onAssignmentChange();
      }
      
      // Close modal
      handleClose();
    } catch (error) {
      showError('Failed to remove assignment. Please try again.');
      console.error('Error removing assignment:', error);
    }
  };

  // Handle close
  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

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
            maxWidth: '500px',
            borderRadius: '12px',
            boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!showConfirmation ? (
            <>
              {/* Header */}
              <div 
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h2 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: '28px',
                    letterSpacing: '-0.03em',
                    color: 'rgba(26, 26, 26, 1)'
                  }}
                >
                  Assignment Details
                </h2>
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

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <div className="space-y-4">
                  {/* User Info */}
                  <div>
                    <label 
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: '16px',
                        letterSpacing: '-0.02em',
                        color: 'rgba(87, 87, 87, 1)',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      User
                    </label>
                    <div 
                      className="rounded-lg"
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(249, 249, 249, 1)',
                        border: '1px solid rgba(229, 229, 229, 1)',
                        borderRadius: '6px'
                      }}
                    >
                      <div 
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          letterSpacing: '-0.03em',
                          color: 'rgba(26, 26, 26, 1)'
                        }}
                      >
                        {user?.name}
                      </div>
                      <div 
                        style={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: 'rgba(87, 87, 87, 1)'
                        }}
                      >
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Site Info */}
                  <div>
                    <label 
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: '16px',
                        letterSpacing: '-0.02em',
                        color: 'rgba(87, 87, 87, 1)',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Site
                    </label>
                    {isEditing ? (
                      <select
                        value={selectedSiteId}
                        onChange={(e) => setSelectedSiteId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          letterSpacing: '-0.03em',
                          color: 'rgba(26, 26, 26, 1)',
                          cursor: 'pointer'
                        }}
                      >
                        {esgMockData.sites.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} - {s.group}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div 
                        className="rounded-lg"
                        style={{
                          padding: '12px',
                          backgroundColor: 'rgba(249, 249, 249, 1)',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          borderRadius: '6px'
                        }}
                      >
                        <div 
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '-0.03em',
                            color: 'rgba(26, 26, 26, 1)'
                          }}
                        >
                          {site?.name}
                        </div>
                        <div 
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: 'rgba(87, 87, 87, 1)'
                          }}
                        >
                          {site?.group}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metric Info */}
                  <div>
                    <label 
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: '16px',
                        letterSpacing: '-0.02em',
                        color: 'rgba(87, 87, 87, 1)',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Metric
                    </label>
                    {isEditing ? (
                      <select
                        value={selectedMetricId}
                        onChange={(e) => setSelectedMetricId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          letterSpacing: '-0.03em',
                          color: 'rgba(26, 26, 26, 1)',
                          cursor: 'pointer'
                        }}
                      >
                        {esgMockData.metrics.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.category})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div 
                        className="rounded-lg"
                        style={{
                          padding: '12px',
                          backgroundColor: 'rgba(249, 249, 249, 1)',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          borderRadius: '6px'
                        }}
                      >
                        <div 
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '-0.03em',
                            color: 'rgba(26, 26, 26, 1)'
                          }}
                        >
                          {metric?.name}
                        </div>
                        <div 
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: 'rgba(87, 87, 87, 1)'
                          }}
                        >
                          {metric?.category}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div 
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid rgba(229, 229, 229, 1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <Button 
                    variant="danger" 
                    onClick={() => setShowConfirmation(true)}
                  >
                    Remove Assignment
                  </Button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {isEditing ? (
                    <>
                      <Button variant="secondary" onClick={() => {
                        setSelectedSiteId(assignment.siteId);
                        setSelectedMetricId(assignment.metricId);
                        setIsEditing(false);
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={handleSaveEdit}
                        disabled={!hasChanges}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Assignment
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Header */}
              <div 
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(229, 229, 229, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AlertLineIcon style={{ width: '24px', height: '24px', color: 'rgba(239, 68, 68, 1)' }} />
                </div>
                <h2 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: '28px',
                    letterSpacing: '-0.03em',
                    color: 'rgba(26, 26, 26, 1)'
                  }}
                >
                  Confirm Removal
                </h2>
              </div>

              {/* Confirmation Content */}
              <div style={{ padding: '24px' }}>
                <p 
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '20px',
                    letterSpacing: '-0.03em',
                    color: 'rgba(87, 87, 87, 1)',
                    marginBottom: '16px'
                  }}
                >
                  Are you sure you want to remove this assignment? This action cannot be undone.
                </p>
                <div 
                  className="rounded-lg"
                  style={{
                    padding: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '6px'
                  }}
                >
                  <div 
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(26, 26, 26, 1)'
                    }}
                  >
                    {user?.name} → {site?.name} → {metric?.name}
                  </div>
                </div>
              </div>

              {/* Confirmation Footer */}
              <div 
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid rgba(229, 229, 229, 1)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}
              >
                <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleRemove}>
                  Yes, Remove
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

EditAssignmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  assignment: PropTypes.object,
  onAssignmentChange: PropTypes.func,
};

export default EditAssignmentModal;

