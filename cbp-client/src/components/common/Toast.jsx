import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import ErrorWarningLineIcon from 'remixicon-react/ErrorWarningLineIcon';
import InformationLineIcon from 'remixicon-react/InformationLineIcon';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';

// Toast Context
const ToastContext = createContext(null);

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed z-50"
      style={{
        top: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        width: '100%'
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

// Individual Toast Item Component
const ToastItem = ({ toast, onRemove }) => {
  const { id, message, type } = toast;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 1)',
          iconColor: 'rgba(16, 185, 129, 1)',
          Icon: CheckLineIcon,
        };
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 1)',
          iconColor: 'rgba(239, 68, 68, 1)',
          Icon: ErrorWarningLineIcon,
        };
      case 'info':
      default:
        return {
          backgroundColor: 'rgba(7, 51, 112, 0.1)',
          borderColor: '#073370',
          iconColor: '#073370',
          Icon: InformationLineIcon,
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.Icon;

  return (
    <div
      className="animate-slide-in"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        border: `1px solid ${styles.borderColor}`,
        borderRadius: '8px',
        boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {/* Icon */}
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: styles.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon style={{ width: '24px', height: '24px', color: styles.iconColor }} />
      </div>

      {/* Message */}
      <div style={{ flex: 1, paddingTop: '8px' }}>
        <p 
          style={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '-0.03em',
            color: 'rgba(26, 26, 26, 1)',
            margin: 0
          }}
        >
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(id)}
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
          color: 'rgba(87, 87, 87, 1)',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(229, 229, 229, 0.5)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <CloseLineIcon style={{ width: '20px', height: '20px' }} />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};


