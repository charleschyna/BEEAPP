import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
};

export const Logo = ({ size = 'medium' }: LogoProps) => {
  const [hasError, setHasError] = useState(false);
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
      <View style={[styles.logoContainer, { width, height }]}>
        {!hasError ? (
          <Image
            source={require('../assets/images/smart-nyuki-logo.png')}
            style={styles.image}
            resizeMode="contain"
            onError={() => setHasError(true)}
          />
        ) : (
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});
