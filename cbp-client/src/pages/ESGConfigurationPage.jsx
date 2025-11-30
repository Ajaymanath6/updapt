import { useState } from 'react';
import { 
  FilterPanel, 
  AssignmentMatrix, 
  UserAssignmentModal,
  AssignmentFilters,
  AssignmentTable,
  EditAssignmentModal,
  CSVImportExport
} from '../components/esg';

/**
 * ESGConfigurationPage - Main page for ESG Configuration Manager
 * Two tabs: Assignment and Review & Audit
 */
const ESGConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState('assignment');
  
  // Assignment tab state
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSiteIds, setModalSiteIds] = useState([]);
  const [modalMetricIds, setModalMetricIds] = useState([]);
  const [assignmentRefreshKey, setAssignmentRefreshKey] = useState(0);

  // Review & Audit tab state
  const [reviewFilters, setReviewFilters] = useState({
    userSearch: '',
    sites: [],
    categories: []
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  // Handle filter changes from FilterPanel (Assignment tab)
  const handleFilterChange = ({ sites, metrics }) => {
    setSelectedSites(sites);
    setSelectedMetrics(metrics);
  };

  // Handle cell click in matrix
  const handleCellClick = (siteId, metricId) => {
    setModalSiteIds([siteId]);
    setModalMetricIds([metricId]);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalSiteIds([]);
    setModalMetricIds([]);
  };

  // Handle assignment changes from Assignment tab
  const handleAssignmentChange = () => {
    // Trigger a refresh of both the matrix and the review table
    setAssignmentRefreshKey(prev => prev + 1);
    setReviewRefreshKey(prev => prev + 1);
  };

  // Handle filter changes from AssignmentFilters (Review & Audit tab)
  const handleReviewFilterChange = (filters) => {
    setReviewFilters(filters);
  };

  // Handle edit assignment
  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  // Handle remove assignment
  const handleRemoveAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAssignment(null);
  };

  // Handle assignment change from Review & Audit tab
  const handleReviewAssignmentChange = () => {
    // Trigger a refresh of both the review table and the matrix
    setReviewRefreshKey(prev => prev + 1);
    setAssignmentRefreshKey(prev => prev + 1);
  };

  // Handle CSV import complete
  const handleImportComplete = () => {
    // Trigger a refresh of both views
    setReviewRefreshKey(prev => prev + 1);
    setAssignmentRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 
          className="font-bold"
          style={{
            fontFamily: 'Inter',
            fontSize: '26px',
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '-0.04em',
            color: '#001A31'
          }}
        >
          ESG Configuration Manager
        </h1>
        <p 
          className="mt-1"
          style={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '1.2',
            letterSpacing: '-0.04em',
            color: '#575757'
          }}
        >
          Manage user-to-data-entry responsibilities for Sites and Metrics.
        </p>
      </div>

      {/* Tab Navigation */}
      <div 
        className="bg-white rounded-lg border"
        style={{
          borderRadius: '8px',
          borderColor: 'rgba(229, 229, 229, 1)',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Tab Headers */}
        <div 
          className="flex"
          style={{
            borderBottom: '1px solid rgba(229, 229, 229, 1)',
            padding: '0'
          }}
        >
          <button
            onClick={() => setActiveTab('assignment')}
            className="transition-colors"
            style={{
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
              letterSpacing: '-0.03em',
              color: activeTab === 'assignment' ? '#073370' : 'rgba(87, 87, 87, 1)',
              borderBottom: activeTab === 'assignment' ? '2px solid #073370' : '2px solid transparent',
              backgroundColor: activeTab === 'assignment' ? 'rgba(7, 51, 112, 0.02)' : 'transparent',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Assignment
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className="transition-colors"
            style={{
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
              letterSpacing: '-0.03em',
              color: activeTab === 'review' ? '#073370' : 'rgba(87, 87, 87, 1)',
              borderBottom: activeTab === 'review' ? '2px solid #073370' : '2px solid transparent',
              backgroundColor: activeTab === 'review' ? 'rgba(7, 51, 112, 0.02)' : 'transparent',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Review & Audit
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'assignment' && (
            <div>
              {/* Assignment Interface */}
              <div className="space-y-6">
                <div>
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
                    Site-Centric Assignment Matrix
                  </h2>
                  <p 
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '20px',
                      letterSpacing: '-0.03em',
                      color: 'rgba(87, 87, 87, 1)'
                    }}
                  >
                    Select Sites and Metrics to assign Users in bulk.
                  </p>
                </div>

                {/* Filter Panel */}
                <FilterPanel onFilterChange={handleFilterChange} />

                {/* Assignment Matrix */}
                <AssignmentMatrix
                  key={assignmentRefreshKey}
                  selectedSites={selectedSites}
                  selectedMetrics={selectedMetrics}
                  onCellClick={handleCellClick}
                />
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div>
              {/* Review & Audit Interface */}
              <div className="space-y-6">
                {/* Header with CSV buttons */}
                <div className="flex items-start justify-between">
                  <div>
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
                      Assignment Review & Audit
                    </h2>
                    <p 
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        letterSpacing: '-0.03em',
                        color: 'rgba(87, 87, 87, 1)'
                      }}
                    >
                      View, search, and manage all existing assignments.
                    </p>
                  </div>
                  
                  {/* CSV Import/Export */}
                  <CSVImportExport onImportComplete={handleImportComplete} />
                </div>

                {/* Filters */}
                <AssignmentFilters onFilterChange={handleReviewFilterChange} />

                {/* Assignment Table */}
                <AssignmentTable
                  filters={reviewFilters}
                  onEdit={handleEditAssignment}
                  onRemove={handleRemoveAssignment}
                  refreshKey={reviewRefreshKey}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Assignment Modal (for Assignment tab) */}
      <UserAssignmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        siteIds={modalSiteIds}
        metricIds={modalMetricIds}
        onAssignmentChange={handleAssignmentChange}
      />

      {/* Edit Assignment Modal (for Review & Audit tab) */}
      <EditAssignmentModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        assignment={selectedAssignment}
        onAssignmentChange={handleReviewAssignmentChange}
      />
    </div>
  );
};

export default ESGConfigurationPage;
