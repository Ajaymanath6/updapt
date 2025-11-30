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
              backgroundColor: '#073370',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                {selectedCombinationsCount} combination{selectedCombinationsCount !== 1 ? 's' : ''} selected
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                ({selectedSiteIds.size} site{selectedSiteIds.size !== 1 ? 's' : ''} × {selectedMetricIds.size} metric{selectedMetricIds.size !== 1 ? 's' : ''})
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAssignUser}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: '#073370',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span style={{ fontSize: '16px' }}>+</span>
                Assign User
              </button>
              <button
                onClick={handleRemoveUser}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '16px' }}>−</span>
                Remove User
              </button>
              <button
                onClick={handleCancelSelection}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                <span style={{ fontSize: '16px' }}>×</span>
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
                paddingLeft: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '6px',
                gap: '8px'
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
                  accentColor: '#073370'
                }}
                title="Select all sites and metrics"
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#575757', textTransform: 'uppercase' }}>
                Metrics / Sites
              </span>
            </div>
            
            {/* Site columns with checkboxes */}
            {selectedSites.map(site => (
              <div 
                key={site.id}
                style={{
                  minWidth: '140px',
                  height: '60px',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  gap: '4px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSiteIds.has(site.id)}
                  onChange={() => handleSiteCheckboxChange(site.id)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#073370'
                  }}
                  title={`Select ${site.name}`}
                />
                <div style={{ fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                  {site.name}
                </div>
                <div style={{ fontSize: '10px', color: '#575757' }}>
                  {site.group}
                </div>
              </div>
            ))}
          </div>

          {/* Data Rows - Grouped by Category */}
          {Object.entries(groupedMetrics).map(([category, metrics]) => (
            <div key={category} style={{ marginBottom: '16px' }}>
              {/* Category Header */}
              <div 
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(7, 51, 112, 0.05)',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#073370', textTransform: 'uppercase' }}>
                  {category}
                </span>
              </div>

              {/* Metric Rows */}
              {metrics.map(metric => (
                <div 
                  key={metric.id} 
                  style={{ display: 'flex', marginBottom: '8px', gap: '8px', alignItems: 'center' }}
                >
                  {/* Metric label with checkbox */}
                  <div 
                    style={{
                      minWidth: '240px',
                      height: '60px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '6px',
                      gap: '8px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMetricIds.has(metric.id)}
                      onChange={() => handleMetricCheckboxChange(metric.id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: '#073370',
                        flexShrink: 0
                      }}
                      title={`Select ${metric.name}`}
                    />
                    <div 
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        flex: 1
                      }}
                      title={metric.name}
                    >
                      {metric.name}
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
              ))}
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
