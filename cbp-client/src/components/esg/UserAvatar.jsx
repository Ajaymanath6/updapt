import PropTypes from 'prop-types';

/**
 * UserAvatar - Displays user avatar with initials and colored background
 * Follows Google/Gmail pattern for avatar generation
 */
const UserAvatar = ({ user, size = 'small' }) => {
  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate consistent color from user name (Google-style)
  const getColorFromName = (name) => {
    if (!name) return '#073370';
    
    // Color palette inspired by Google/Gmail avatars
    const colors = [
      '#1abc9c', // Turquoise
      '#2ecc71', // Emerald
      '#3498db', // Blue
      '#9b59b6', // Purple
      '#34495e', // Dark gray
      '#16a085', // Green sea
      '#27ae60', // Nephritis
      '#2980b9', // Belize hole
      '#8e44ad', // Wisteria
      '#2c3e50', // Midnight blue
      '#f39c12', // Orange
      '#e74c3c', // Red
      '#e67e22', // Carrot
      '#95a5a6', // Concrete
      '#d35400', // Pumpkin
    ];

    // Generate hash from name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use hash to pick a color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(user.name);
  const backgroundColor = getColorFromName(user.name);

  // Size configurations
  const sizeConfig = {
    small: {
      width: '28px',
      height: '28px',
      fontSize: '11px',
    },
    medium: {
      width: '36px',
      height: '36px',
      fontSize: '14px',
    },
  };

  const config = sizeConfig[size] || sizeConfig.small;

  return (
    <div
      style={{
        width: config.width,
        height: config.height,
        borderRadius: '50%',
        backgroundColor: backgroundColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.fontSize,
        fontWeight: 600,
        flexShrink: 0,
        border: '2px solid white',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
      }}
      title={user.name}
    >
      {initials}
    </div>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};

export default UserAvatar;

