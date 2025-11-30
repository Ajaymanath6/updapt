import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { esgMockData, getUserById, getSiteById, getMetricById, createAssignment } from '../../lib/esgMockData';
import DownloadLineIcon from 'remixicon-react/DownloadLineIcon';
import UploadLineIcon from 'remixicon-react/UploadLineIcon';
import Button from '../common/Button';
import { useToast } from '../common/Toast';

/**
 * CSVImportExport - Component for importing and exporting assignments via CSV
 */
const CSVImportExport = ({ onImportComplete }) => {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  // Export assignments to CSV
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['User ID', 'User Name', 'User Email', 'Site ID', 'Site Name', 'Metric ID', 'Metric Name', 'Metric Category', 'Created At'];
      const rows = esgMockData.assignments.map(assignment => {
        const user = getUserById(assignment.userId);
        const site = getSiteById(assignment.siteId);
        const metric = getMetricById(assignment.metricId);
        
        return [
          assignment.userId,
          user?.name || '',
          user?.email || '',
          assignment.siteId,
          site?.name || '',
          assignment.metricId,
          metric?.name || '',
          metric?.category || '',
          assignment.createdAt
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `esg-assignments-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`Exported ${esgMockData.assignments.length} assignments to CSV`);
    } catch (error) {
      showError('Failed to export CSV. Please try again.');
      console.error('Error exporting CSV:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  // Import assignments from CSV
  const handleImport = async (file) => {
    setIsImporting(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        showError('CSV file is empty or invalid');
        setIsImporting(false);
        return;
      }

      // Parse CSV (simple parser - assumes no commas in values or quoted values)
      const parseCSVLine = (line) => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      };

      const headers = parseCSVLine(lines[0]);
      const dataRows = lines.slice(1);

      // Find column indices
      const userIdIndex = headers.findIndex(h => h.toLowerCase().includes('user id') || h.toLowerCase().includes('user_id'));
      const siteIdIndex = headers.findIndex(h => h.toLowerCase().includes('site id') || h.toLowerCase().includes('site_id'));
      const metricIdIndex = headers.findIndex(h => h.toLowerCase().includes('metric id') || h.toLowerCase().includes('metric_id'));

      if (userIdIndex === -1 || siteIdIndex === -1 || metricIdIndex === -1) {
        showError('CSV must contain columns: User ID, Site ID, and Metric ID');
        setIsImporting(false);
        return;
      }

      // Process rows
      let successCount = 0;
      let failCount = 0;
      const errors = [];

      dataRows.forEach((line, index) => {
        const values = parseCSVLine(line);
        const userId = values[userIdIndex];
        const siteId = values[siteIdIndex];
        const metricId = values[metricIdIndex];

        // Validate
        const user = getUserById(userId);
        const site = getSiteById(siteId);
        const metric = getMetricById(metricId);

        if (!user) {
          errors.push(`Row ${index + 2}: User ID "${userId}" not found`);
          failCount++;
          return;
        }
        if (!site) {
          errors.push(`Row ${index + 2}: Site ID "${siteId}" not found`);
          failCount++;
          return;
        }
        if (!metric) {
          errors.push(`Row ${index + 2}: Metric ID "${metricId}" not found`);
          failCount++;
          return;
        }

        // Create assignment
        const result = createAssignment(userId, siteId, metricId);
        if (result) {
          successCount++;
        } else {
          // Duplicate - count as success
          successCount++;
        }
      });

      // Show results
      if (failCount > 0) {
        showError(`Import completed with errors: ${successCount} successful, ${failCount} failed. Check console for details.`);
        if (errors.length > 0) {
          console.error('Import errors:', errors);
        }
      } else if (successCount > 0) {
        showSuccess(`Successfully imported ${successCount} assignment${successCount !== 1 ? 's' : ''}`);
      } else {
        showInfo('No assignments were imported');
      }

      // Notify parent
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      showError(`Error importing CSV: ${error.message}`);
      console.error('CSV import error:', error);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center" style={{ gap: '12px' }}>
      {/* Export Button */}
      <Button 
        variant="secondary" 
        icon={DownloadLineIcon}
        onClick={handleExport}
      >
        Export CSV
      </Button>

      {/* Import Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <Button 
          variant="secondary" 
          icon={UploadLineIcon}
          onClick={() => fileInputRef.current?.click()}
          className={isImporting ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isImporting ? 'Importing...' : 'Import CSV'}
        </Button>
      </div>
    </div>
  );
};

CSVImportExport.propTypes = {
  onImportComplete: PropTypes.func,
};

export default CSVImportExport;

