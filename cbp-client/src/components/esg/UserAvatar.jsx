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

  // Generate consistent light/pastel color from user name
  const getColorFromName = (name) => {
    if (!name) return 'rgba(7, 51, 112, 0.1)';
    
    // Light/pastel color palette
    const colors = [
      'rgba(26, 188, 156, 0.15)', // Light turquoise
      'rgba(46, 204, 113, 0.15)', // Light emerald
      'rgba(52, 152, 219, 0.15)', // Light blue
      'rgba(155, 89, 182, 0.15)', // Light purple
      'rgba(52, 73, 94, 0.1)', // Light dark gray
      'rgba(22, 160, 133, 0.15)', // Light green sea
      'rgba(39, 174, 96, 0.15)', // Light green
      'rgba(41, 128, 185, 0.15)', // Light blue
      'rgba(142, 68, 173, 0.15)', // Light purple
      'rgba(44, 62, 80, 0.1)', // Light midnight blue
      'rgba(243, 156, 18, 0.15)', // Light orange
      'rgba(231, 76, 60, 0.15)', // Light red
      'rgba(230, 126, 34, 0.15)', // Light carrot
      'rgba(149, 165, 166, 0.15)', // Light gray
      'rgba(211, 84, 0, 0.15)', // Light pumpkin
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
        color: 'rgba(87, 87, 87, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.fontSize,
        fontWeight: 600,
        flexShrink: 0,
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

