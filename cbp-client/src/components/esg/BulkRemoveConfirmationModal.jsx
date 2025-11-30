import PropTypes from 'prop-types';
import AlertLineIcon from 'remixicon-react/AlertLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import Button from '../common/Button';

/**
 * BulkRemoveConfirmationModal - Confirmation dialog for bulk user removal
 * Shows warning and requires explicit confirmation for destructive action
 */
const BulkRemoveConfirmationModal = ({ isOpen, onClose, onConfirm, siteCount, metricCount, combinationCount }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
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
        onClick={onClose}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertLineIcon 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    color: '#e74c3c' 
                  }} 
                />
              </div>
              <h2 
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: '28px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(26, 26, 26, 1)',
                  margin: 0
                }}
              >
                Remove Users from Assignments?
              </h2>
            </div>
            <button
              onClick={onClose}
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
          <div 
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Warning Message */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(231, 76, 60, 0.05)',
                borderLeft: '4px solid #e74c3c',
                borderRadius: '6px'
              }}
            >
              <p 
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(26, 26, 26, 1)',
                  margin: '0 0 8px 0'
                }}
              >
                This will remove ALL assigned users from the selected combinations:
              </p>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '-0.03em',
                  color: 'rgba(87, 87, 87, 1)',
                  marginTop: '8px'
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  • <strong>{siteCount}</strong> site{siteCount !== 1 ? 's' : ''} × <strong>{metricCount}</strong> metric{metricCount !== 1 ? 's' : ''} = <strong>{combinationCount}</strong> combination{combinationCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <p 
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '-0.03em',
                color: 'rgba(87, 87, 87, 1)',
                margin: 0
              }}
            >
              All users currently assigned to these combinations will be removed. This action cannot be undone.
            </p>
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
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
              Remove Users
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

BulkRemoveConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  siteCount: PropTypes.number.isRequired,
  metricCount: PropTypes.number.isRequired,
  combinationCount: PropTypes.number.isRequired,
};

export default BulkRemoveConfirmationModal;

