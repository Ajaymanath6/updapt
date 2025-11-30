import PropTypes from 'prop-types';

/**
 * Button component with multiple variants and optional icon support
 * @param {Object} props
 * @param {('primary'|'secondary'|'danger')} props.variant - Button style variant
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler function
 * @param {React.ComponentType} props.icon - Optional Remix Icon component
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({ variant = 'primary', children, onClick, icon: Icon, className = '' }) => {
  const baseStyles = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'text-white hover:opacity-90 focus:ring-2',
    secondary: 'hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  const flexStyles = Icon ? 'flex items-center' : '';

  const getVariantStyle = () => {
    if (variant === 'primary') {
      return {
        backgroundColor: '#073370',
        color: 'rgba(255, 255, 255, 1)'
      };
    } else if (variant === 'secondary') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        border: '1px solid rgba(229, 229, 229, 1)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        color: 'rgba(26, 26, 26, 1)'
      };
    }
    return {};
  };

  return (
    <button
      onClick={onClick}
      className={`${combinedStyles} ${flexStyles}`}
      style={{
        ...getVariantStyle(),
        borderRadius: '4px',
        height: '36px',
        paddingTop: '6px',
        paddingBottom: '6px',
        paddingLeft: '8px',
        paddingRight: '8px',
        gap: Icon ? '4px' : '0',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '-0.03em',
        fontWeight: variant === 'secondary' ? 500 : 'medium'
      }}
    >
      {Icon && <Icon style={{ width: '16px', height: '16px', color: variant === 'secondary' ? 'rgba(87, 87, 87, 1)' : 'rgba(255, 255, 255, 1)' }} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export default Button;

