import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { LogoImage } from '@/components/LogoImage';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LogoImage size="large" />
      <Text style={styles.title}>Smart Nyuki</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.loadingText}>Loading your hives...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  loadingText: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
});
