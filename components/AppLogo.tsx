import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

type AppLogoProps = {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
};

/**
 * Temporary text-based logo component until the image loading issues are resolved
 */
export const AppLogo = ({ size = 'medium', showText = true }: AppLogoProps) => {
  let fontSize, paddingVertical, paddingHorizontal;
  
  switch (size) {
    case 'small':
      fontSize = 18;
      paddingVertical = spacing.sm;
      paddingHorizontal = spacing.md;
      break;
    case 'large':
      fontSize = 32;
      paddingVertical = spacing.lg;
      paddingHorizontal = spacing.xl;
      break;
    case 'medium':
    default:
      fontSize = 24;
      paddingVertical = spacing.md;
      paddingHorizontal = spacing.lg;
      break;
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.logoContainer, 
        { 
          paddingVertical, 
          paddingHorizontal 
        }
      ]}>
        <Text style={[styles.logoText, { fontSize }]}>
          Smart Nyuki
        </Text>
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
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
