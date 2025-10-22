import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { getImageDimensions, getBorderRadius, getShadowStyle, screenData } from '../utils/ResponsiveDesign';

const ResponsiveImage = ({ 
  source, 
  style, 
  width = 100, 
  height = 100, 
  borderRadius = 8,
  shadow = true,
  resizeMode = 'cover',
  ...props 
}) => {
  const dimensions = getImageDimensions(width, height);
  const responsiveBorderRadius = getBorderRadius(borderRadius);
  
  const imageStyle = [
    {
      width: dimensions.width,
      height: dimensions.height,
      borderRadius: responsiveBorderRadius,
    },
    shadow && getShadowStyle(2),
    style,
  ];

  return (
    <Image
      source={source}
      style={imageStyle}
      resizeMode={resizeMode}
      {...props}
    />
  );
};

export default ResponsiveImage;







