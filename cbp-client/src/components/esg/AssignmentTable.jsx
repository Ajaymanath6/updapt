import { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { esgMockData, getUserById, getSiteById, getMetricById } from '../../lib/esgMockData';
import Edit2LineIcon from 'remixicon-react/Edit2LineIcon';
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon';

/**
 * AssignmentTable - Table displaying all assignments with virtual scrolling
 * Supports filtering and actions (Edit, Remove)
 */
const AssignmentTable = ({ filters, onEdit, onRemove, refreshKey }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const tableContainerRef = useRef(null);
  const ROW_HEIGHT = 60; // Height of each row in pixels
  const BUFFER_SIZE = 10; // Number of extra rows to render above/below visible area

  // Filter assignments based on filters
  const filteredAssignments = useMemo(() => {
    let filtered = [...esgMockData.assignments];

    // Filter by user search
    if (filters.userSearch) {
      const term = filters.userSearch.toLowerCase();
      filtered = filtered.filter(assignment => {
        const user = getUserById(assignment.userId);
        return user && (
          user.name.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
        );
      });
    }

    // Filter by sites
    if (filters.sites && filters.sites.length > 0) {
      const siteIds = filters.sites.map(s => s.id);
      filtered = filtered.filter(assignment => siteIds.includes(assignment.siteId));
    }

    // Filter by metrics
    if (filters.metrics && filters.metrics.length > 0) {
      const metricIds = filters.metrics.map(m => m.id);
      filtered = filtered.filter(assignment => metricIds.includes(assignment.metricId));
    }

    return filtered;
  }, [filters, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle scroll for virtual scrolling
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
    const end = Math.min(
      filteredAssignments.length,
      Math.ceil((scrollTop + e.target.clientHeight) / ROW_HEIGHT) + BUFFER_SIZE
    );
    setVisibleRange({ start, end });
  };

  // Reset scroll position when filters change
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      setVisibleRange({ start: 0, end: 50 });
    }
  }, [filters]);

  // Get visible assignments
  const visibleAssignments = useMemo(() => {
    return filteredAssignments.slice(visibleRange.start, visibleRange.end);
  }, [filteredAssignments, visibleRange]);

  // Calculate total height and offset
  const totalHeight = filteredAssignments.length * ROW_HEIGHT;
  const offsetY = visibleRange.start * ROW_HEIGHT;

  return (
    <div 
      className="bg-white rounded-lg border"
      style={{
        borderRadius: '8px',
        borderColor: 'rgba(229, 229, 229, 1)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}
    >
      {/* Table Header */}
      <div 
        className="grid grid-cols-12 gap-4"
        style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(249, 249, 249, 1)',
          borderBottom: '1px solid rgba(229, 229, 229, 1)'
        }}
      >
        <div className="col-span-3">
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '-0.02em',
              color: 'rgba(87, 87, 87, 1)',
              textTransform: 'uppercase'
            }}
          >
            User Name
          </span>
        </div>
        <div className="col-span-3">
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '-0.02em',
              color: 'rgba(87, 87, 87, 1)',
              textTransform: 'uppercase'
            }}
          >
            Site Name
          </span>
        </div>
        <div className="col-span-4">
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '-0.02em',
              color: 'rgba(87, 87, 87, 1)',
              textTransform: 'uppercase'
            }}
          >
            Metric Name
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '16px',
              letterSpacing: '-0.02em',
              color: 'rgba(87, 87, 87, 1)',
              textTransform: 'uppercase'
            }}
          >
            Actions
          </span>
        </div>
      </div>

      {/* Table Body with Virtual Scrolling */}
      <div 
        ref={tableContainerRef}
        onScroll={handleScroll}
        style={{
          height: '500px',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {filteredAssignments.length === 0 ? (
          <div 
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            {/* Icon */}
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(7, 51, 112, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#073370" 
                strokeWidth="2"
                style={{ width: '32px', height: '32px' }}
              >
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Message */}
            <div>
              <h3 
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(26, 26, 26, 1)',
                  marginBottom: '8px'
                }}
              >
                {esgMockData.assignments.length === 0 ? 'No assignments yet' : 'No assignments found'}
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)',
                  maxWidth: '400px'
                }}
              >
                {esgMockData.assignments.length === 0 
                  ? 'Get started by going to the "Assignment" tab to create your first user assignments.'
                  : 'No assignments match your current filters. Try adjusting your search criteria or clearing filters.'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleAssignments.map((assignment) => {
                const user = getUserById(assignment.userId);
                const site = getSiteById(assignment.siteId);
                const metric = getMetricById(assignment.metricId);

                if (!user || !site || !metric) return null;

                return (
                  <div 
                    key={assignment.id}
                    className="grid grid-cols-12 gap-4 hover:bg-gray-50"
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid rgba(245, 245, 245, 1)',
                      height: `${ROW_HEIGHT}px`,
                      alignItems: 'center'
                    }}
                  >
                    {/* User Name */}
                    <div className="col-span-3">
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

                    {/* Site Name */}
                    <div className="col-span-3">
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
                        {site.name}
                      </div>
                      <div 
                        style={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: 'rgba(87, 87, 87, 1)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {site.group}
                      </div>
                    </div>

                    {/* Metric Name */}
                    <div className="col-span-4">
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
                        {metric.name}
                      </div>
                      <div 
                        style={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: 'rgba(87, 87, 87, 1)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {metric.category}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end" style={{ gap: '8px' }}>
                      <button
                        onClick={() => onEdit(assignment)}
                        className="transition-colors"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          color: 'rgba(87, 87, 87, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(7, 51, 112, 0.05)';
                          e.currentTarget.style.borderColor = '#073370';
                          e.currentTarget.style.color = '#073370';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(229, 229, 229, 1)';
                          e.currentTarget.style.color = 'rgba(87, 87, 87, 1)';
                        }}
                        title="Edit assignment"
                      >
                        <Edit2LineIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button
                        onClick={() => onRemove(assignment)}
                        className="transition-colors"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(229, 229, 229, 1)',
                          color: 'rgba(87, 87, 87, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 1)';
                          e.currentTarget.style.color = 'rgba(239, 68, 68, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(229, 229, 229, 1)';
                          e.currentTarget.style.color = 'rgba(87, 87, 87, 1)';
                        }}
                        title="Remove assignment"
                      >
                        <DeleteBinLineIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(229, 229, 229, 1)',
          backgroundColor: 'rgba(249, 249, 249, 1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <p 
          style={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: '-0.03em',
            color: 'rgba(87, 87, 87, 1)'
          }}
        >
          Showing {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

AssignmentTable.propTypes = {
  filters: PropTypes.shape({
    userSearch: PropTypes.string,
    sites: PropTypes.array,
    metrics: PropTypes.array,
  }).isRequired,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  refreshKey: PropTypes.number,
};

export default AssignmentTable;


