import React from 'react';
import { View, StyleSheet } from 'react-native';
import { screenData, getSpacing } from '../utils/ResponsiveDesign';

const ResponsiveGrid = ({ 
  children, 
  columns = null, 
  spacing = 10, 
  style,
  ...props 
}) => {
  const gridColumns = columns || screenData.gridColumns;
  const responsiveSpacing = getSpacing(spacing);
  
  const gridStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -responsiveSpacing / 2,
  };

  const itemStyle = {
    width: `${100 / gridColumns}%`,
    paddingHorizontal: responsiveSpacing / 2,
    paddingVertical: responsiveSpacing / 2,
  };

  return (
    <View style={[gridStyle, style]} {...props}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default ResponsiveGrid;
















