import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  getSpacing, 
  getResponsivePadding, 
  getBorderRadius, 
  getShadowStyle, 
  screenData 
} from '../utils/ResponsiveDesign';

const ResponsiveContainer = ({ 
  children, 
  style, 
  scrollable = false,
  padding = 20,
  backgroundColor = '#FFFFFF',
  borderRadius = 0,
  shadow = false,
  ...props 
}) => {
  const ContainerComponent = scrollable ? ScrollView : View;
  
  const containerStyle = [
    styles.container,
    {
      paddingHorizontal: getResponsivePadding(padding),
      paddingVertical: getResponsivePadding(padding),
      backgroundColor,
      ...(borderRadius > 0 && { borderRadius: getBorderRadius(borderRadius) }),
      ...(shadow && getShadowStyle(2)),
    },
    style,
  ];

  return (
    <ContainerComponent 
      style={containerStyle}
      showsVerticalScrollIndicator={scrollable ? false : undefined}
      {...props}
    >
      {children}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ResponsiveContainer;
