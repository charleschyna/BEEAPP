import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getLogoUri } from '../assets/nyuki-logo';

type LogoImageProps = {
  size?: 'small' | 'medium' | 'large';
};

export const LogoImage = ({ size = 'medium' }: LogoImageProps) => {
  let width, height;
  
  switch (size) {
    case 'small':
      width = 120;
      height = 70;
      break;
    case 'large':
      width = 240;
      height = 140;
      break;
    case 'medium':
    default:
      width = 180;
      height = 100;
      break;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getLogoUri() }}
        style={[styles.image, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // Base styling if needed
  },
});
