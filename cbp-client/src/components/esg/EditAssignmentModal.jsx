import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getUserById, getSiteById, getMetricById, removeAssignment, createAssignment, getAssignmentsForUser, esgMockData } from '../../lib/esgMockData';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import AlertLineIcon from 'remixicon-react/AlertLineIcon';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import SearchLineIcon from 'remixicon-react/SearchLineIcon';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

/**
 * EditAssignmentModal - Modal for managing all assignments for a specific user
 * Supports two modes: 'edit' (multi-select sites & metrics) and 'delete'
 */
const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentChange, mode = 'delete' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Always start in read-only mode
  const [selectedSites, setSelectedSites] = useState([]); // Changed to array for multi-select
  const [selectedMetrics, setSelectedMetrics] = useState([]); // Changed to array for multi-select
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [metricSearchTerm, setMetricSearchTerm] = useState('');
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

  // Get all assignments for this user
  const userAssignments = useMemo(() => {
    if (!assignment) return [];
    return getAssignmentsForUser(assignment.userId);
  }, [assignment]);

  // Initialize edit form when assignment changes
  useEffect(() => {
    if (assignment) {
      // Load all current assignments for this user
      const currentAssignments = getAssignmentsForUser(assignment.userId);
      const currentSiteIds = [...new Set(currentAssignments.map(a => a.siteId))];
      const currentMetricIds = [...new Set(currentAssignments.map(a => a.metricId))];
      
      setSelectedSites(currentSiteIds.map(id => getSiteById(id)).filter(Boolean));
      setSelectedMetrics(currentMetricIds.map(id => getMetricById(id)).filter(Boolean));
      setIsEditing(false); // Always start in read-only mode
      setShowConfirmation(false);
      setIsSiteDropdownOpen(false);
      setIsMetricDropdownOpen(false);
      setSiteSearchTerm('');
      setMetricSearchTerm('');
    }
  }, [assignment, mode]);

  // Filter sites based on search term
  const filteredSites = useMemo(() => {
    if (!siteSearchTerm) return esgMockData.sites;
    const term = siteSearchTerm.toLowerCase();
    return esgMockData.sites.filter(site => 
      site.name.toLowerCase().includes(term) || 
      site.group.toLowerCase().includes(term)
    );
  }, [siteSearchTerm]);

  // Filter metrics based on search term
  const filteredMetrics = useMemo(() => {
    if (!metricSearchTerm) return esgMockData.metrics;
    const term = metricSearchTerm.toLowerCase();
    return esgMockData.metrics.filter(metric => 
      metric.name.toLowerCase().includes(term) || 
      metric.category.toLowerCase().includes(term)
    );
  }, [metricSearchTerm]);

  // Group metrics by category
  const groupedMetrics = useMemo(() => {
    const groups = {};
    filteredMetrics.forEach(metric => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, [filteredMetrics]);

  // Handle site selection toggle
  const toggleSite = (site) => {
    const isSelected = selectedSites.some(s => s.id === site.id);
    if (isSelected) {
      setSelectedSites(selectedSites.filter(s => s.id !== site.id));
    } else {
      setSelectedSites([...selectedSites, site]);
    }
  };

  // Handle metric selection toggle
  const toggleMetric = (metric) => {
    const isSelected = selectedMetrics.some(m => m.id === metric.id);
    if (isSelected) {
      setSelectedMetrics(selectedMetrics.filter(m => m.id !== metric.id));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  // Clear all sites
  const clearSites = () => {
    setSelectedSites([]);
  };

  // Clear all metrics
  const clearMetrics = () => {
    setSelectedMetrics([]);
  };

  if (!isOpen || !assignment) return null;

  const user = getUserById(assignment.userId);
  const site = getSiteById(assignment.siteId);
  const metric = getMetricById(assignment.metricId);

  // Check if changes were made
  const initialSiteIds = new Set(userAssignments.map(a => a.siteId));
  const initialMetricIds = new Set(userAssignments.map(a => a.metricId));
  const currentSiteIds = new Set(selectedSites.map(s => s.id));
  const currentMetricIds = new Set(selectedMetrics.map(m => m.id));
  
  const hasChanges = 
    initialSiteIds.size !== currentSiteIds.size ||
    initialMetricIds.size !== currentMetricIds.size ||
    ![...initialSiteIds].every(id => currentSiteIds.has(id)) ||
    ![...initialMetricIds].every(id => currentMetricIds.has(id));

  // Handle save edit (bulk update)
  const handleSaveEdit = () => {
    try {
      const userId = assignment.userId;
      
      // Step 1: Remove all existing assignments for this user
      const existingAssignments = getAssignmentsForUser(userId);
      existingAssignments.forEach(a => {
        removeAssignment(a.id);
      });
      
      // Step 2: Create new assignments for all selected site-metric combinations
      let createdCount = 0;
      selectedSites.forEach(site => {
        selectedMetrics.forEach(metric => {
          const result = createAssignment(userId, site.id, metric.id);
          if (result) createdCount++;
        });
      });
      
      // Log the change (audit log simulation)
      console.log('AUDIT LOG: User assignments updated', {
        user: user?.name,
        oldCount: existingAssignments.length,
        newCount: createdCount,
        sites: selectedSites.map(s => s.name),
        metrics: selectedMetrics.map(m => m.name),
        timestamp: new Date().toISOString()
      });
      
      showSuccess(`Updated assignments for ${user?.name}: ${createdCount} assignment${createdCount !== 1 ? 's' : ''} created`);
      
      // Notify parent component
      if (onAssignmentChange) {
        onAssignmentChange();
      }
      
      // Close modal
      handleClose();
    } catch (error) {
      showError('Failed to update assignments. Please try again.');
      console.error('Error updating assignments:', error);
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
                  {mode === 'edit' ? `Manage Assignments for ${user?.name}` : 'Assignment Details'}
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
                  {/* Assignment Summary (only in edit mode, read-only view) */}
                  {mode === 'edit' && !isEditing && (
                    <div 
                      className="rounded-lg"
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'rgba(7, 51, 112, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div 
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          letterSpacing: '-0.03em',
                          color: '#073370'
                        }}
                      >
                        Total: {selectedSites.length} Site{selectedSites.length !== 1 ? 's' : ''} × {selectedMetrics.length} Metric{selectedMetrics.length !== 1 ? 's' : ''} = {selectedSites.length * selectedMetrics.length} Assignment{(selectedSites.length * selectedMetrics.length) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

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

                  {/* Sites Info */}
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
                      Sites
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
                            color: selectedSites.length > 0 ? 'rgba(26, 26, 26, 1)' : 'rgba(87, 87, 87, 1)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>
                            {selectedSites.length > 0 
                              ? `${selectedSites.length} of ${esgMockData.sites.length} Sites selected`
                              : 'Select Sites...'}
                          </span>
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
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            {/* Search input */}
                            <div style={{ padding: '12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                              <div className="relative">
                                <SearchLineIcon 
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2" 
                                  style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
                                />
                                <input
                                  type="text"
                                  placeholder="Search sites..."
                                  value={siteSearchTerm}
                                  onChange={(e) => setSiteSearchTerm(e.target.value)}
                                  className="w-full focus:outline-none"
                                  style={{
                                    borderRadius: '4px',
                                    height: '36px',
                                    paddingLeft: '32px',
                                    paddingRight: '8px',
                                    backgroundColor: 'rgba(249, 249, 249, 1)',
                                    border: '1px solid rgba(229, 229, 229, 1)',
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    letterSpacing: '-0.03em'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Clear button */}
                            {selectedSites.length > 0 && (
                              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                                <button
                                  onClick={clearSites}
                                  className="flex items-center"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#073370',
                                    cursor: 'pointer',
                                    gap: '4px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0
                                  }}
                                >
                                  <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                                  Clear all
                                </button>
                              </div>
                            )}

                            {/* Site list */}
                            <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                              {filteredSites.map(s => {
                                const isSelected = selectedSites.some(site => site.id === s.id);
                                return (
                                  <div
                                    key={s.id}
                                    onClick={() => toggleSite(s)}
                                    className="flex items-center cursor-pointer hover:bg-gray-50"
                                    style={{
                                      padding: '10px 12px',
                                      gap: '8px',
                                      borderBottom: '1px solid rgba(245, 245, 245, 1)'
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleSite(s)}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        width: '18px',
                                        height: '18px',
                                        cursor: 'pointer',
                                        accentColor: '#073370',
                                        borderRadius: '8px',
                                        flexShrink: 0
                                      }}
                                    />
                                    <div className="flex-1">
                                      <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.03em', color: 'rgba(26, 26, 26, 1)' }}>
                                        {s.name}
                                      </div>
                                      <div style={{ fontSize: '12px', lineHeight: '16px', color: 'rgba(87, 87, 87, 1)' }}>
                                        {s.group}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              {filteredSites.length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(87, 87, 87, 1)', fontSize: '14px' }}>
                                  No sites found
                                </div>
                              )}
                            </div>
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
                          {selectedSites.length} Site{selectedSites.length !== 1 ? 's' : ''} Selected
                        </div>
                        <div 
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: 'rgba(87, 87, 87, 1)',
                            marginTop: '4px'
                          }}
                        >
                          {selectedSites.slice(0, 3).map(s => s.name).join(', ')}
                          {selectedSites.length > 3 && ` +${selectedSites.length - 3} more`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metrics Info */}
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
                      Metrics
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
                            color: selectedMetrics.length > 0 ? 'rgba(26, 26, 26, 1)' : 'rgba(87, 87, 87, 1)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>
                            {selectedMetrics.length > 0 
                              ? `${selectedMetrics.length} of ${esgMockData.metrics.length} Metrics selected`
                              : 'Select Metrics...'}
                          </span>
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
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            {/* Search input */}
                            <div style={{ padding: '12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                              <div className="relative">
                                <SearchLineIcon 
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2" 
                                  style={{ width: '16px', height: '16px', color: 'rgba(87, 87, 87, 1)' }}
                                />
                                <input
                                  type="text"
                                  placeholder="Search metrics..."
                                  value={metricSearchTerm}
                                  onChange={(e) => setMetricSearchTerm(e.target.value)}
                                  className="w-full focus:outline-none"
                                  style={{
                                    borderRadius: '4px',
                                    height: '36px',
                                    paddingLeft: '32px',
                                    paddingRight: '8px',
                                    backgroundColor: 'rgba(249, 249, 249, 1)',
                                    border: '1px solid rgba(229, 229, 229, 1)',
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    letterSpacing: '-0.03em'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Clear button */}
                            {selectedMetrics.length > 0 && (
                              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(229, 229, 229, 1)' }}>
                                <button
                                  onClick={clearMetrics}
                                  className="flex items-center"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#073370',
                                    cursor: 'pointer',
                                    gap: '4px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0
                                  }}
                                >
                                  <CloseLineIcon style={{ width: '16px', height: '16px' }} />
                                  Clear all
                                </button>
                              </div>
                            )}

                            {/* Metric list grouped by category */}
                            <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                              {Object.entries(groupedMetrics).map(([category, metrics]) => (
                                <div key={category}>
                                  {/* Category header */}
                                  <div 
                                    style={{
                                      padding: '8px 12px',
                                      backgroundColor: 'rgba(245, 245, 245, 1)',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      lineHeight: '16px',
                                      letterSpacing: '-0.02em',
                                      color: 'rgba(87, 87, 87, 1)',
                                      textTransform: 'uppercase'
                                    }}
                                  >
                                    {category}
                                  </div>
                                  {/* Metrics in category */}
                                  {metrics.map(m => {
                                    const isSelected = selectedMetrics.some(metric => metric.id === m.id);
                                    return (
                                      <div
                                        key={m.id}
                                        onClick={() => toggleMetric(m)}
                                        className="flex items-center cursor-pointer hover:bg-gray-50"
                                        style={{
                                          padding: '10px 12px',
                                          gap: '8px',
                                          borderBottom: '1px solid rgba(245, 245, 245, 1)'
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => toggleMetric(m)}
                                          onClick={(e) => e.stopPropagation()}
                                          style={{
                                            width: '18px',
                                            height: '18px',
                                            cursor: 'pointer',
                                            accentColor: '#073370',
                                            borderRadius: '8px',
                                            flexShrink: 0
                                          }}
                                        />
                                        <div 
                                          style={{
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            lineHeight: '20px',
                                            letterSpacing: '-0.03em',
                                            color: 'rgba(26, 26, 26, 1)'
                                          }}
                                        >
                                          {m.name}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                              {Object.keys(groupedMetrics).length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(87, 87, 87, 1)', fontSize: '14px' }}>
                                  No metrics found
                                </div>
                              )}
                            </div>
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
                          {selectedMetrics.length} Metric{selectedMetrics.length !== 1 ? 's' : ''} Selected
                        </div>
                        <div 
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: 'rgba(87, 87, 87, 1)',
                            marginTop: '4px'
                          }}
                        >
                          {selectedMetrics.slice(0, 2).map(m => m.name.split('(')[0].trim()).join(', ')}
                          {selectedMetrics.length > 2 && ` +${selectedMetrics.length - 2} more`}
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
                      // Reset to original selections
                      const currentAssignments = getAssignmentsForUser(assignment.userId);
                      const currentSiteIds = [...new Set(currentAssignments.map(a => a.siteId))];
                      const currentMetricIds = [...new Set(currentAssignments.map(a => a.metricId))];
                      
                      setSelectedSites(currentSiteIds.map(id => getSiteById(id)).filter(Boolean));
                      setSelectedMetrics(currentMetricIds.map(id => getMetricById(id)).filter(Boolean));
                      setIsEditing(false);
                      setIsSiteDropdownOpen(false);
                      setIsMetricDropdownOpen(false);
                      setSiteSearchTerm('');
                      setMetricSearchTerm('');
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSaveEdit}
                      disabled={!hasChanges || selectedSites.length === 0 || selectedMetrics.length === 0}
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
                        Edit Assignments
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

