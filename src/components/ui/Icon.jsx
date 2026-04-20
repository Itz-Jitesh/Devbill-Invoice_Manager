'use client';

/**
 * Icon Component
 * @description RESTORED: Uses absolute paths from /public/icons/ for stability.
 * Method A: Simple & Stable image mapping.
 */
const Icon = ({ name, className = '', size = 'md' }) => {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const pixelSize = sizeMap[size] || 20;

  // Normalize name to handle common variations (e.g. edit_svg -> edit)
  const iconName = name.replace('_svg', '').toLowerCase();

  // List of icons we have moved to /public/icons/
  const validIcons = ['edit', 'delete', 'remove', 'add', 'check_circle', 'visibility', 'mail', 'search', 'notifications', 'account_circle', 'logout', 'close', 'error', 'warning', 'info', 'chevron_right'];

  if (validIcons.includes(iconName)) {
    return (
      <img
        src={`/icons/${iconName}.svg`}
        alt={iconName}
        width={pixelSize}
        height={pixelSize}
        className={`inline-block object-contain ${className}`}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        // Console log for debugging as requested
        onLoad={() => console.log(`Icon loaded: ${iconName}`)}
        onError={() => console.error(`Failed to load icon: ${iconName}`)}
      />
    );
  }

  // Fallback to Material Symbols if not in our primary icon set
  return (
    <span 
      className={`material-symbols-outlined ${className}`} 
      style={{ fontSize: `${pixelSize}px`, width: `${pixelSize}px`, height: `${pixelSize}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {iconName}
    </span>
  );
};

export default Icon;
