import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getUserById, getSiteById, getMetricById, removeAssignment, esgMockData } from '../../lib/esgMockData';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import AlertLineIcon from 'remixicon-react/AlertLineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

/**
 * EditAssignmentModal - Modal for editing or removing a single assignment
 * Supports two modes: 'edit' and 'delete'
 */
const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentChange, mode = 'delete' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Always start in read-only mode
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [selectedMetricId, setSelectedMetricId] = useState('');
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
  const { showSuccess, showError } = useToast();

  // Refs for click outside detection
  const siteDropdownRef = useRef(null);
  const metricDropdownRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(event.target)) {
        setIsSiteDropdownOpen(false);
      }
      if (metricDropdownRef.current && !metricDropdownRef.current.contains(event.target)) {
        setIsMetricDropdownOpen(false);
      }
    };

    if (isSiteDropdownOpen || isMetricDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSiteDropdownOpen, isMetricDropdownOpen]);

  // Initialize edit form when assignment changes
  useEffect(() => {
    if (assignment) {
      setSelectedSiteId(assignment.siteId);
      setSelectedMetricId(assignment.metricId);
      setIsEditing(false); // Always start in read-only mode
      setShowConfirmation(false);
      setIsSiteDropdownOpen(false);
      setIsMetricDropdownOpen(false);
    }
  }, [assignment, mode]);

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
                  {mode === 'edit' ? 'Edit Assignment' : 'Assignment Details'}
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
                      <div className="relative" ref={siteDropdownRef}>
                        <button
                          onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
                          className="w-full flex items-center justify-between"
                          style={{
                            borderRadius: '4px',
                            height: '40px',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            border: '1px solid rgba(229, 229, 229, 1)',
                            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '-0.03em',
                            color: 'rgba(26, 26, 26, 1)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>{getSiteById(selectedSiteId)?.name || 'Select Site...'}</span>
                          <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
                        </button>
                        {isSiteDropdownOpen && (
                          <div
                            className="absolute z-10 w-full mt-2"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              border: '1px solid rgba(229, 229, 229, 1)',
                              borderRadius: '8px',
                              boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                              maxHeight: '300px',
                              overflowY: 'auto'
                            }}
                          >
                            {esgMockData.sites.map(s => (
                              <div
                                key={s.id}
                                onClick={() => {
                                  setSelectedSiteId(s.id);
                                  setIsSiteDropdownOpen(false);
                                }}
                                className="cursor-pointer hover:bg-gray-50"
                                style={{
                                  padding: '10px 12px',
                                  borderBottom: '1px solid rgba(245, 245, 245, 1)',
                                  backgroundColor: selectedSiteId === s.id ? 'rgba(7, 51, 112, 0.05)' : 'transparent'
                                }}
                              >
                                <div style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(26, 26, 26, 1)' }}>
                                  {s.name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(87, 87, 87, 1)' }}>
                                  {s.group}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                      <div className="relative" ref={metricDropdownRef}>
                        <button
                          onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
                          className="w-full flex items-center justify-between"
                          style={{
                            borderRadius: '4px',
                            height: '40px',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            border: '1px solid rgba(229, 229, 229, 1)',
                            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '-0.03em',
                            color: 'rgba(26, 26, 26, 1)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>{getMetricById(selectedMetricId)?.name || 'Select Metric...'}</span>
                          <ArrowDownSLineIcon style={{ width: '20px', height: '20px', color: 'rgba(87, 87, 87, 1)' }} />
                        </button>
                        {isMetricDropdownOpen && (
                          <div
                            className="absolute z-10 w-full mt-2"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              border: '1px solid rgba(229, 229, 229, 1)',
                              borderRadius: '8px',
                              boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.1)',
                              maxHeight: '300px',
                              overflowY: 'auto'
                            }}
                          >
                            {esgMockData.metrics.map(m => (
                              <div
                                key={m.id}
                                onClick={() => {
                                  setSelectedMetricId(m.id);
                                  setIsMetricDropdownOpen(false);
                                }}
                                className="cursor-pointer hover:bg-gray-50"
                                style={{
                                  padding: '10px 12px',
                                  borderBottom: '1px solid rgba(245, 245, 245, 1)',
                                  backgroundColor: selectedMetricId === m.id ? 'rgba(7, 51, 112, 0.05)' : 'transparent'
                                }}
                              >
                                <div style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(26, 26, 26, 1)' }}>
                                  {m.name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'rgba(87, 87, 87, 1)' }}>
                                  {m.category}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}
              >
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={() => {
                      setSelectedSiteId(assignment.siteId);
                      setSelectedMetricId(assignment.metricId);
                      setIsEditing(false);
                      setIsSiteDropdownOpen(false);
                      setIsMetricDropdownOpen(false);
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
                    {mode === 'edit' ? (
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Assignment
                      </Button>
                    ) : (
                      <Button 
                        variant="danger" 
                        onClick={() => setShowConfirmation(true)}
                      >
                        Remove Assignment
                      </Button>
                    )}
                  </>
                )}
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
  mode: PropTypes.oneOf(['edit', 'delete']),
};

export default EditAssignmentModal;

