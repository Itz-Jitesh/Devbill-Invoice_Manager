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

  /**
   * FIX: Reverting to font-based Material Symbols for all icons.
   * SVG-in-IMG approach fails with "currentColor" and dark themes.
   */
  return (
    <span 
      className={`material-symbols-outlined select-none ${className}`} 
      style={{ 
        fontSize: `${pixelSize}px`, 
        width: `${pixelSize}px`, 
        height: `${pixelSize}px`, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      {iconName}
    </span>
  );
};

export default Icon;
