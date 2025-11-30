import PropTypes from 'prop-types';
import { StatusTag } from '../common';
import EditLineIcon from 'remixicon-react/EditLineIcon';
import ImageLineIcon from 'remixicon-react/ImageLineIcon';
import CheckLineIcon from 'remixicon-react/CheckLineIcon';
import TimeLineIcon from 'remixicon-react/TimeLineIcon';

/**
 * AdCard - Card component for displaying ad publishing information
 * @param {Object} props
 * @param {Object} props.ad - Ad object with title, status, linkedAuction, publishDate, imageUrl
 * @param {Function} props.onEdit - Edit action handler
 */
const AdCard = ({ ad, onEdit }) => {
  return (
    <div 
      className="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      style={{
        width: '100%',
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: 'rgba(229, 229, 229, 1)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        padding: '16px'
      }}
    >
      {/* Header with Status and Edit Icon */}
      <div className="flex items-center justify-between mb-4">
        <StatusTag status={ad.status} />
        <button
          onClick={() => onEdit && onEdit(ad)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Edit"
        >
          <EditLineIcon style={{ width: '20px', height: '20px', color: '#575757' }} />
        </button>
      </div>

      {/* Title */}
      <h3 
        className="mb-4"
        style={{
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '24px',
          letterSpacing: '-0.03em',
          color: 'rgba(26, 26, 26, 1)'
        }}
      >
        {ad.title}
      </h3>

      {/* Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden rounded-lg mb-4">
        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = e.target.parentElement.querySelector('.placeholder-icon');
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        )}
        <div 
          className={`placeholder-icon absolute inset-0 w-full h-full items-center justify-center bg-gray-100 ${ad.imageUrl ? 'hidden' : 'flex'}`}
        >
          <ImageLineIcon className="w-16 h-16 text-gray-300" />
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '16px',
              letterSpacing: '-0.03em',
              color: 'rgba(87, 87, 87, 1)'
            }}
          >
            Linked Auction
          </span>
          <div 
            style={{
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: 'rgba(26, 26, 26, 1)'
            }}
          >
            {ad.linkedAuction}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '16px',
              letterSpacing: '-0.03em',
              color: 'rgba(87, 87, 87, 1)'
            }}
          >
            Publish Date
          </span>
          <div 
            style={{
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: '-0.03em',
              color: 'rgba(26, 26, 26, 1)'
            }}
          >
            {ad.publishDate}
          </div>
        </div>
      </div>
    </div>
  );
};

AdCard.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    linkedAuction: PropTypes.string.isRequired,
    publishDate: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
};

export default AdCard;

