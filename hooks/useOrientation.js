import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/**
 * Hook to track device orientation changes
 * Returns current dimensions and orientation state
 */
export default function useOrientation() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape = dimensions.width > dimensions.height;
  const isPortrait = dimensions.height > dimensions.width;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isLandscape,
    isPortrait,
    aspectRatio: dimensions.height / dimensions.width,
  };
}

