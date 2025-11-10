import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get initial dimensions
let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;

// Listen to dimension changes and update (for backward compatibility)
// Note: In components, use useOrientation hook for reactive updates
const dimensionSubscription = Dimensions.addEventListener('change', ({ window }) => {
  SCREEN_WIDTH = window.width;
  SCREEN_HEIGHT = window.height;
});

// Base dimensions (iPhone 12 Pro as reference)
const baseWidth = 390;
const baseHeight = 844;

// Responsive scaling functions
export const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / baseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Screen size categories - now considers orientation
export const getScreenCategory = (width = SCREEN_WIDTH, height = SCREEN_HEIGHT) => {
  const isLandscape = width > height;
  const effectiveWidth = isLandscape ? height : width; // Use smaller dimension for categorization
  
  if (effectiveWidth < 400) {
    return 'small'; // iPhone SE, small Android phones
  } else if (effectiveWidth >= 400 && effectiveWidth < 768) {
    return 'medium'; // Regular phones
  } else if (effectiveWidth >= 768 && effectiveWidth < 1024) {
    return 'large'; // Large phones, small tablets
  } else {
    return 'tablet'; // Tablets, foldables
  }
};

// Device type detection - now considers orientation
export const getDeviceType = (width = SCREEN_WIDTH, height = SCREEN_HEIGHT) => {
  const aspectRatio = height / width;
  const isLandscape = width > height;

  if (aspectRatio > 2) {
    return 'phone'; // Very tall phones
  } else if (aspectRatio > 1.5) {
    return 'phone'; // Regular phones
  } else if (aspectRatio > 1.2) {
    return 'tablet'; // Tablets in portrait
  } else {
    return 'tablet'; // Tablets in landscape
  }
};

// Responsive font sizes - now considers orientation
export const getFontSize = (size, width = SCREEN_WIDTH, height = SCREEN_HEIGHT) => {
  const category = getScreenCategory(width, height);
  const deviceType = getDeviceType(width, height);
  const isLandscape = width > height;
  
  let multiplier = 1;
  
  switch (category) {
    case 'small':
      multiplier = 0.9;
      break;
    case 'medium':
      multiplier = 1;
      break;
    case 'large':
      multiplier = 1.1;
      break;
    case 'tablet':
      multiplier = 1.3;
      break;
  }
  
  if (deviceType === 'tablet') {
    multiplier *= 1.2;
  }
  
  // Adjust for landscape - slightly reduce font size in landscape for better fit
  if (isLandscape) {
    multiplier *= 0.95;
  }
  
  return moderateScale(size * multiplier, 0.5);
};

// Responsive spacing - now considers orientation
export const getSpacing = (size, width = SCREEN_WIDTH, height = SCREEN_HEIGHT) => {
  const category = getScreenCategory(width, height);
  const isLandscape = width > height;
  
  let baseSize = size;
  
  switch (category) {
    case 'small':
      baseSize = size * 0.8;
      break;
    case 'medium':
      baseSize = size;
      break;
    case 'large':
      baseSize = size * 1.1;
      break;
    case 'tablet':
      baseSize = size * 1.4;
      break;
    default:
      baseSize = size;
  }
  
  // In landscape, reduce vertical spacing but keep horizontal spacing
  if (isLandscape) {
    baseSize *= 0.9;
  }
  
  return moderateScale(baseSize);
};

// Responsive image dimensions
export const getImageDimensions = (baseWidth, baseHeight) => {
  const category = getScreenCategory();
  const deviceType = getDeviceType();
  
  let widthMultiplier = 1;
  let heightMultiplier = 1;
  
  switch (category) {
    case 'small':
      widthMultiplier = 0.8;
      heightMultiplier = 0.8;
      break;
    case 'medium':
      widthMultiplier = 1;
      heightMultiplier = 1;
      break;
    case 'large':
      widthMultiplier = 1.1;
      heightMultiplier = 1.1;
      break;
    case 'tablet':
      widthMultiplier = 1.4;
      heightMultiplier = 1.4;
      break;
  }
  
  if (deviceType === 'tablet') {
    widthMultiplier *= 1.2;
    heightMultiplier *= 1.2;
  }
  
  return {
    width: moderateScale(baseWidth * widthMultiplier),
    height: moderateScale(baseHeight * heightMultiplier),
  };
};

// Responsive breakpoints
export const breakpoints = {
  xs: 0,      // Extra small devices (phones in portrait)
  sm: 400,    // Small devices (phones in landscape)
  md: 768,    // Medium devices (tablets in portrait)
  lg: 1024,   // Large devices (tablets in landscape)
  xl: 1200,   // Extra large devices (large tablets)
};

// Check if current screen matches breakpoint
export const isBreakpoint = (breakpoint) => {
  const width = SCREEN_WIDTH;
  switch (breakpoint) {
    case 'xs':
      return width >= breakpoints.xs && width < breakpoints.sm;
    case 'sm':
      return width >= breakpoints.sm && width < breakpoints.md;
    case 'md':
      return width >= breakpoints.md && width < breakpoints.lg;
    case 'lg':
      return width >= breakpoints.lg && width < breakpoints.xl;
    case 'xl':
      return width >= breakpoints.xl;
    default:
      return false;
  }
};

// Responsive grid system
export const getGridColumns = () => {
  const category = getScreenCategory();
  const deviceType = getDeviceType();
  
  if (deviceType === 'tablet') {
    return category === 'tablet' ? 3 : 2;
  }
  return 1;
};

// Responsive margins and paddings
export const getResponsivePadding = (basePadding) => {
  const category = getScreenCategory();
  const deviceType = getDeviceType();
  
  let multiplier = 1;
  if (deviceType === 'tablet') {
    multiplier = 1.5;
  }
  
  switch (category) {
    case 'small':
      return getSpacing(basePadding * 0.7 * multiplier);
    case 'medium':
      return getSpacing(basePadding * multiplier);
    case 'large':
      return getSpacing(basePadding * 1.2 * multiplier);
    case 'tablet':
      return getSpacing(basePadding * 1.5 * multiplier);
    default:
      return getSpacing(basePadding * multiplier);
  }
};

// Responsive border radius
export const getBorderRadius = (baseRadius) => {
  const category = getScreenCategory();
  
  switch (category) {
    case 'small':
      return moderateScale(baseRadius * 0.8);
    case 'medium':
      return moderateScale(baseRadius);
    case 'large':
      return moderateScale(baseRadius * 1.1);
    case 'tablet':
      return moderateScale(baseRadius * 1.3);
    default:
      return moderateScale(baseRadius);
  }
};

// Responsive shadow
export const getShadowStyle = (elevation = 2) => {
  const category = getScreenCategory();
  const deviceType = getDeviceType();
  
  let shadowElevation = elevation;
  if (deviceType === 'tablet') {
    shadowElevation = elevation * 1.5;
  }
  
  return {
    elevation: shadowElevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: shadowElevation,
    },
    shadowOpacity: 0.25,
    shadowRadius: shadowElevation * 1.5,
  };
};

// Helper function to get current screen data (updates dynamically)
export const getScreenData = () => {
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;
  const isLandscape = width > height;
  const isPortrait = height > width;
  
  return {
    width,
    height,
    category: getScreenCategory(width, height),
    deviceType: getDeviceType(width, height),
    isTablet: getDeviceType(width, height) === 'tablet',
    isPhone: getDeviceType(width, height) === 'phone',
    isSmall: getScreenCategory(width, height) === 'small',
    isMedium: getScreenCategory(width, height) === 'medium',
    isLarge: getScreenCategory(width, height) === 'large',
    isTabletSize: getScreenCategory(width, height) === 'tablet',
    isXs: isBreakpoint('xs'),
    isSm: isBreakpoint('sm'),
    isMd: isBreakpoint('md'),
    isLg: isBreakpoint('lg'),
    isXl: isBreakpoint('xl'),
    gridColumns: getGridColumns(),
    aspectRatio: height / width,
    isLandscape,
    isPortrait,
  };
};

// Screen dimensions (static for backward compatibility - use getScreenData() for dynamic)
export const screenData = getScreenData();
