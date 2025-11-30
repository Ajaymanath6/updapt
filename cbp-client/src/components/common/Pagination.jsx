import PropTypes from 'prop-types';
import ArrowLeftSLineIcon from 'remixicon-react/ArrowLeftSLineIcon';
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon';

/**
 * Pagination - Figma-designed pagination component with results counter
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {Function} props.onPageChange - Callback when page changes
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        height: '33px',
      }}
    >
      {/* Results Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'IBM Plex Sans, Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: '#575757',
          }}
        >
          Showing
        </span>
        <span
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2px 8px',
            backgroundColor: '#F5F5F5',
            borderRadius: '80px',
            fontFamily: 'IBM Plex Sans, Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: '#1A1A1A',
          }}
        >
          {startItem}-{endItem}
        </span>
        <span
          style={{
            fontFamily: 'IBM Plex Sans, Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: '#737373',
          }}
        >
          of
        </span>
        <span
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2px 8px',
            backgroundColor: '#F5F5F5',
            borderRadius: '80px',
            fontFamily: 'IBM Plex Sans, Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: '#1A1A1A',
          }}
        >
          {totalItems}
        </span>
        <span
          style={{
            fontFamily: 'IBM Plex Sans, Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '1.4em',
            color: '#575757',
          }}
        >
          results
        </span>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: '33px',
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7px',
            border: 'none',
            background: 'transparent',
            borderRadius: '6px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
          aria-label="Previous page"
        >
          <ArrowLeftSLineIcon style={{ width: '18px', height: '18px', color: '#073370' }} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px 11px',
                  fontFamily: 'IBM Plex Sans, Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '1.4em',
                  color: '#073370',
                }}
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px 11px',
                backgroundColor: isActive ? '#F5F5F5' : 'transparent',
                border: 'none',
                borderRadius: '80px',
                fontFamily: 'IBM Plex Sans, Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '1.4em',
                color: '#073370',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#FAFAFA';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7px',
            border: 'none',
            background: 'transparent',
            borderRadius: '6px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
          aria-label="Next page"
        >
          <ArrowRightSLineIcon style={{ width: '18px', height: '18px', color: '#073370' }} />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;

