import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const baseWidth = 390;
const baseHeight = 844;

// Responsive scaling functions
export const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / baseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Screen size categories
export const getScreenCategory = () => {
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;
  const aspectRatio = height / width;

  if (width < 400) {
    return 'small'; // iPhone SE, small Android phones
  } else if (width >= 400 && width < 768) {
    return 'medium'; // Regular phones
  } else if (width >= 768 && width < 1024) {
    return 'large'; // Large phones, small tablets
  } else {
    return 'tablet'; // Tablets, foldables
  }
};

// Device type detection
export const getDeviceType = () => {
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;
  const aspectRatio = height / width;

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

// Responsive font sizes
export const getFontSize = (size) => {
  const category = getScreenCategory();
  const deviceType = getDeviceType();
  
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
  
  return moderateScale(size * multiplier);
};

// Responsive spacing
export const getSpacing = (size) => {
  const category = getScreenCategory();
  
  switch (category) {
    case 'small':
      return moderateScale(size * 0.8);
    case 'medium':
      return moderateScale(size);
    case 'large':
      return moderateScale(size * 1.1);
    case 'tablet':
      return moderateScale(size * 1.4);
    default:
      return moderateScale(size);
  }
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

// Screen dimensions
export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  category: getScreenCategory(),
  deviceType: getDeviceType(),
  isTablet: getDeviceType() === 'tablet',
  isPhone: getDeviceType() === 'phone',
  isSmall: getScreenCategory() === 'small',
  isMedium: getScreenCategory() === 'medium',
  isLarge: getScreenCategory() === 'large',
  isTabletSize: getScreenCategory() === 'tablet',
  // New responsive properties
  isXs: isBreakpoint('xs'),
  isSm: isBreakpoint('sm'),
  isMd: isBreakpoint('md'),
  isLg: isBreakpoint('lg'),
  isXl: isBreakpoint('xl'),
  gridColumns: getGridColumns(),
  aspectRatio: SCREEN_HEIGHT / SCREEN_WIDTH,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
  isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
};
