import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MatrixCell from './MatrixCell';
import UserAssignmentModal from './UserAssignmentModal';
import BulkRemoveConfirmationModal from './BulkRemoveConfirmationModal';
import { getUserCountForSiteMetric, getAssignmentsForSiteMetric, removeAssignment } from '../../lib/esgMockData';
import { useToast } from '../common/Toast';

/**
 * AssignmentMatrix - Dynamic grid showing Site-Metric combinations
 * FLIPPED: Rows = Metrics (grouped by category), Columns = Sites
 */
const AssignmentMatrix = ({ selectedSites, selectedMetrics, onCellClick }) => {
  console.log('AssignmentMatrix render:', { 
    sitesCount: selectedSites?.length, 
    metricsCount: selectedMetrics?.length 
  });

  // State for tracking selected sites and metrics
  const [selectedSiteIds, setSelectedSiteIds] = useState(new Set());
  const [selectedMetricIds, setSelectedMetricIds] = useState(new Set());
  
  // State for bulk assignment modal
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  
  // State for bulk remove confirmation modal
  const [isBulkRemoveModalOpen, setIsBulkRemoveModalOpen] = useState(false);
  
  // Toast notifications
  const { showSuccess, showError } = useToast();

  // Reset selections when sites or metrics change
  useEffect(() => {
    setSelectedSiteIds(new Set());
    setSelectedMetricIds(new Set());
  }, [selectedSites, selectedMetrics]);

  // Check if all sites are selected
  const allSitesSelected = selectedSites.length > 0 && selectedSiteIds.size === selectedSites.length;
  
  // Check if all metrics are selected
  const allMetricsSelected = selectedMetrics.length > 0 && selectedMetricIds.size === selectedMetrics.length;
  
  // Check if everything is selected
  const allSelected = allSitesSelected && allMetricsSelected;

  // Toggle master checkbox (select/deselect all)
  const handleMasterCheckboxChange = () => {
    if (allSelected) {
      // Deselect all
      setSelectedSiteIds(new Set());
      setSelectedMetricIds(new Set());
    } else {
      // Select all
      setSelectedSiteIds(new Set(selectedSites.map(s => s.id)));
      setSelectedMetricIds(new Set(selectedMetrics.map(m => m.id)));
    }
  };

  // Toggle site column selection
  const handleSiteCheckboxChange = (siteId) => {
    const newSelected = new Set(selectedSiteIds);
    if (newSelected.has(siteId)) {
      newSelected.delete(siteId);
    } else {
      newSelected.add(siteId);
    }
    setSelectedSiteIds(newSelected);
  };

  // Toggle metric row selection
  const handleMetricCheckboxChange = (metricId) => {
    const newSelected = new Set(selectedMetricIds);
    if (newSelected.has(metricId)) {
      newSelected.delete(metricId);
    } else {
      newSelected.add(metricId);
    }
    setSelectedMetricIds(newSelected);
  };

  // Safety check
  if (!selectedSites || !selectedMetrics) {
    console.error('Missing props');
    return <div>Error: Missing data</div>;
  }

  // Empty state
  if (selectedSites.length === 0 || selectedMetrics.length === 0) {
    return (
      <div 
        style={{
          padding: '60px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e5e5'
        }}
      >
        <h3 style={{ marginBottom: '8px' }}>Select Sites and Metrics to Begin</h3>
        <p style={{ color: '#575757' }}>
          Use the filters above to select Sites and Metrics
        </p>
      </div>
    );
  }

  // Group metrics by category
  const groupedMetrics = {};
  selectedMetrics.forEach(metric => {
    if (metric && metric.category) {
      if (!groupedMetrics[metric.category]) {
        groupedMetrics[metric.category] = [];
      }
      groupedMetrics[metric.category].push(metric);
    }
  });

  // Check if any selections are made
  const hasSelections = selectedSiteIds.size > 0 || selectedMetricIds.size > 0;

  // Calculate total selected combinations
  const selectedCombinationsCount = selectedSiteIds.size * selectedMetricIds.size;

  // Handle assign user action
  const handleAssignUser = () => {
    console.log('Opening bulk assign modal for:', {
      sites: Array.from(selectedSiteIds),
      metrics: Array.from(selectedMetricIds),
      combinations: selectedCombinationsCount
    });
    setIsBulkAssignModalOpen(true);
  };

  // Handle remove user action - show confirmation modal
  const handleRemoveUser = () => {
    console.log('Opening bulk remove confirmation for:', {
      sites: Array.from(selectedSiteIds),
      metrics: Array.from(selectedMetricIds),
      combinations: selectedCombinationsCount
    });
    setIsBulkRemoveModalOpen(true);
  };

  // Handle confirmed bulk removal
  const handleConfirmRemoval = () => {
    try {
      let removedCount = 0;

      // Remove all assignments for selected site-metric combinations
      Array.from(selectedSiteIds).forEach(siteId => {
        Array.from(selectedMetricIds).forEach(metricId => {
          const assignments = getAssignmentsForSiteMetric(siteId, metricId);
          assignments.forEach(assignment => {
            const result = removeAssignment(assignment.id);
            if (result) removedCount++;
          });
        });
      });

      // Show success message
      if (removedCount > 0) {
        showSuccess(`Successfully removed ${removedCount} assignment${removedCount !== 1 ? 's' : ''}`);
      }

      // Clear selections
      setSelectedSiteIds(new Set());
      setSelectedMetricIds(new Set());

      // Force re-render by triggering a state update
      // The matrix will automatically show updated user counts
    } catch (error) {
      showError('Failed to remove assignments. Please try again.');
      console.error('Error removing assignments:', error);
    }
  };

  // Handle assignment change (refresh matrix after bulk assignment)
  const handleAssignmentChange = () => {
    console.log('Assignments updated, clearing selections');
    // Clear selections after successful assignment
    setSelectedSiteIds(new Set());
    setSelectedMetricIds(new Set());
    // The matrix will automatically re-render with updated user counts
  };

  // Handle cancel (clear all selections)
  const handleCancelSelection = () => {
    console.log('Canceling selections');
    setSelectedSiteIds(new Set());
    setSelectedMetricIds(new Set());
  };

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e5e5',
        overflow: 'auto'
      }}
    >
      <div style={{ padding: '16px' }}>
        {/* Contextual Action Bar - Only shown when selections are made */}
        {hasSelections && (
          <div 
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(249, 249, 249, 1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(26, 26, 26, 1)' }}>
                You have {selectedCombinationsCount} combination{selectedCombinationsCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAssignUser}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#073370',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.9)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#073370'}
              >
                + Assign User
              </button>
              <button
                onClick={handleRemoveUser}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#073370',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.9)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#073370'}
              >
                − Remove User
              </button>
              <button
                onClick={handleCancelSelection}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: 'rgba(26, 26, 26, 1)',
                  border: '1px solid rgba(229, 229, 229, 1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(249, 249, 249, 1)';
                  e.currentTarget.style.borderColor = 'rgba(7, 51, 112, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'rgba(229, 229, 229, 1)';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ minWidth: 'fit-content' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', marginBottom: '12px', gap: '8px' }}>
            {/* Corner cell with master checkbox */}
            <div 
              style={{ 
                minWidth: '240px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#ffffff',
                border: allSelected ? '1.5px solid #073370' : '1px solid rgba(229, 229, 229, 1)',
                borderRadius: '8px',
                gap: '10px',
                transition: 'all 0.2s',
                boxShadow: allSelected 
                  ? '0px 2px 8px rgba(7, 51, 112, 0.15)' 
                  : '0px 1px 3px rgba(0, 0, 0, 0.08)'
              }}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleMasterCheckboxChange}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: '#073370',
                  borderRadius: '8px'
                }}
                title="Select all sites and metrics"
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#575757', textTransform: 'uppercase' }}>
                Metrics / Sites
              </span>
            </div>
            
            {/* Site columns as clickable cards */}
            {selectedSites.map(site => {
              const isSelected = selectedSiteIds.has(site.id);
              return (
                <div 
                  key={site.id}
                  onClick={() => handleSiteCheckboxChange(site.id)}
                  style={{
                    minWidth: '140px',
                    height: '60px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    backgroundColor: '#ffffff',
                    border: isSelected ? '1.5px solid #073370' : '1px solid rgba(229, 229, 229, 1)',
                    borderRadius: '8px',
                    gap: '10px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxShadow: isSelected 
                      ? '0px 2px 8px rgba(7, 51, 112, 0.15)' 
                      : '0px 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(7, 51, 112, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(229, 229, 229, 1)';
                    }
                  }}
                  title={`Click to ${isSelected ? 'deselect' : 'select'} ${site.name}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSiteCheckboxChange(site.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#073370',
                      borderRadius: '8px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                    title={`Select ${site.name}`}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: isSelected ? '#073370' : 'rgba(26, 26, 26, 1)', 
                      lineHeight: '18px' 
                    }}>
                      {site.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: isSelected ? 'rgba(7, 51, 112, 0.7)' : 'rgba(87, 87, 87, 0.7)', 
                      lineHeight: '14px' 
                    }}>
                      {site.group}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Rows - Grouped by Category */}
          {Object.entries(groupedMetrics).map(([category, metrics]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              {/* Category Header - extends across full width */}
              <div 
                style={{
                  display: 'flex',
                  marginBottom: '12px',
                  gap: '8px',
                  alignItems: 'stretch'
                }}
              >
                <div 
                  style={{
                    minWidth: '240px',
                    padding: '10px 16px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#073370', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {category}
                  </span>
                </div>
                {/* Extend background across site columns */}
                {selectedSites.length > 0 && (
                  <div 
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  />
                )}
              </div>

              {/* Metric Rows */}
              {metrics.map(metric => {
                const isMetricSelected = selectedMetricIds.has(metric.id);
                return (
                  <div 
                    key={metric.id} 
                    style={{ 
                      display: 'flex', 
                      marginBottom: '8px', 
                      gap: '8px', 
                      alignItems: 'center'
                    }}
                  >
                    {/* Metric label as clickable card */}
                    <div 
                      onClick={() => handleMetricCheckboxChange(metric.id)}
                      style={{
                        minWidth: '240px',
                        height: '60px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        backgroundColor: '#ffffff',
                        border: isMetricSelected ? '1.5px solid #073370' : '1px solid rgba(229, 229, 229, 1)',
                        borderRadius: '8px',
                        gap: '10px',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        boxShadow: isMetricSelected 
                          ? '0px 2px 8px rgba(7, 51, 112, 0.15)' 
                          : '0px 1px 3px rgba(0, 0, 0, 0.08)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(7, 51, 112, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isMetricSelected) {
                          e.currentTarget.style.borderColor = 'rgba(229, 229, 229, 1)';
                        }
                      }}
                      title={`Click to ${isMetricSelected ? 'deselect' : 'select'} ${metric.name}`}
                    >
                      <input
                        type="checkbox"
                        checked={isMetricSelected}
                        onChange={() => handleMetricCheckboxChange(metric.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#073370',
                          borderRadius: '8px',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                        title={`Select ${metric.name}`}
                      />
                      <div 
                        style={{
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        <div 
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: isMetricSelected ? '#073370' : 'rgba(26, 26, 26, 1)',
                            lineHeight: '20px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                          title={metric.name}
                        >
                          {metric.name.split('(')[0].trim()}
                        </div>
                        {metric.name.includes('(') && (
                          <div 
                            style={{
                              fontSize: '11px',
                              color: isMetricSelected ? 'rgba(7, 51, 112, 0.7)' : 'rgba(87, 87, 87, 0.7)',
                              lineHeight: '14px',
                              marginTop: '2px'
                            }}
                          >
                            {metric.name.match(/\([^)]+\)/)?.[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cells for each site */}
                    {selectedSites.map(site => {
                      const userCount = getUserCountForSiteMetric(site.id, metric.id);
                      return (
                        <MatrixCell
                          key={`${site.id}-${metric.id}`}
                          siteId={site.id}
                          metricId={metric.id}
                          userCount={userCount}
                          onClick={onCellClick}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e5e5',
            backgroundColor: '#f9f9f9',
            marginTop: '16px',
            textAlign: 'center'
          }}
        >
          <p style={{ fontSize: '12px', color: '#575757', margin: 0 }}>
            Use the checkboxes to select rows, columns, or individual cells. Then, use the action bar that appears to assign or remove users in bulk.
          </p>
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      <UserAssignmentModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        siteIds={Array.from(selectedSiteIds)}
        metricIds={Array.from(selectedMetricIds)}
        onAssignmentChange={handleAssignmentChange}
      />

      {/* Bulk Remove Confirmation Modal */}
      <BulkRemoveConfirmationModal
        isOpen={isBulkRemoveModalOpen}
        onClose={() => setIsBulkRemoveModalOpen(false)}
        onConfirm={handleConfirmRemoval}
        siteCount={selectedSiteIds.size}
        metricCount={selectedMetricIds.size}
        combinationCount={selectedCombinationsCount}
      />
    </div>
  );
};

AssignmentMatrix.propTypes = {
  selectedSites: PropTypes.array.isRequired,
  selectedMetrics: PropTypes.array.isRequired,
  onCellClick: PropTypes.func,
};

export default AssignmentMatrix;
