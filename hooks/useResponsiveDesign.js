import { useMemo } from 'react';
import useOrientation from './useOrientation';
import {
  getScreenCategory,
  getDeviceType,
  getFontSize,
  getSpacing,
  getImageDimensions,
  getResponsivePadding,
  getBorderRadius,
  getShadowStyle,
  getGridColumns,
  isBreakpoint,
  scale,
  verticalScale,
  moderateScale,
} from '../utils/ResponsiveDesign';

/**
 * Hook that provides responsive design utilities that update with orientation changes
 */
export default function useResponsiveDesign() {
  const orientation = useOrientation();

  return useMemo(() => {
    const { width, height, isLandscape, isPortrait, aspectRatio } = orientation;
    
    const category = getScreenCategory(width, height);
    const deviceType = getDeviceType(width, height);
    
    return {
      // Dimensions
      width,
      height,
      isLandscape,
      isPortrait,
      aspectRatio,
      
      // Device info
      category,
      deviceType,
      isTablet: deviceType === 'tablet',
      isPhone: deviceType === 'phone',
      isSmall: category === 'small',
      isMedium: category === 'medium',
      isLarge: category === 'large',
      isTabletSize: category === 'tablet',
      
      // Breakpoints
      isXs: isBreakpoint('xs'),
      isSm: isBreakpoint('sm'),
      isMd: isBreakpoint('md'),
      isLg: isBreakpoint('lg'),
      isXl: isBreakpoint('xl'),
      
      // Utilities
      gridColumns: getGridColumns(),
      
      // Responsive functions (pre-bound with current dimensions)
      getFontSize: (size) => getFontSize(size, width, height),
      getSpacing: (size) => getSpacing(size, width, height),
      getImageDimensions: (baseWidth, baseHeight) => 
        getImageDimensions(baseWidth, baseHeight),
      getResponsivePadding: (basePadding) => 
        getResponsivePadding(basePadding),
      getBorderRadius: (baseRadius) => getBorderRadius(baseRadius),
      getShadowStyle: (elevation) => getShadowStyle(elevation),
      
      // Scaling functions
      scale: (size) => scale(size),
      verticalScale: (size) => verticalScale(size),
      moderateScale: (size, factor) => moderateScale(size, factor),
    };
  }, [orientation]);
}

