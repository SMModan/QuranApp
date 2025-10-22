import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getFontSize, getSpacing, screenData } from '../utils/ResponsiveDesign';

const ResponsiveText = ({ 
  children, 
  style, 
  size = 'medium',
  weight = 'normal',
  color = '#000000',
  align = 'left',
  lineHeight = null,
  ...props 
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'xs':
        return getFontSize(10);
      case 'small':
        return getFontSize(12);
      case 'medium':
        return getFontSize(16);
      case 'large':
        return getFontSize(20);
      case 'xlarge':
        return getFontSize(24);
      case 'xxlarge':
        return getFontSize(28);
      case 'title':
        return getFontSize(32);
      case 'hero':
        return getFontSize(40);
      default:
        return getFontSize(16);
    }
  };

  const getLineHeight = () => {
    if (lineHeight !== null) {
      return lineHeight;
    }
    const fontSize = getSizeValue();
    return fontSize * (screenData.isTablet ? 1.5 : 1.4);
  };

  return (
    <Text 
      style={[
        styles.text,
        {
          fontSize: getSizeValue(),
          fontWeight: weight,
          color: color,
          textAlign: align,
          lineHeight: getLineHeight(),
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default styles removed to allow full customization
  },
});

export default ResponsiveText;
