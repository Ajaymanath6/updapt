import PropTypes from 'prop-types';

/**
 * Card component - A generic wrapper card with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ children, className = '' }) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
  const combinedStyles = `${baseStyles} ${className}`;

  return (
    <div 
      className={combinedStyles}
      style={{
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
      }}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

