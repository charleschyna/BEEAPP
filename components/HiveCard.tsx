import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Thermometer, Droplets, Scale } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface HiveCardProps {
  hive: {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    weight: number;
    status: 'healthy' | 'warning' | 'danger';
  };
}

export function HiveCard({ hive }: HiveCardProps) {
  const statusColors = {
    healthy: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  return (
    <Pressable style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{hive.name}</Text>
        <View style={[styles.status, { backgroundColor: statusColors[hive.status] }]}>
          <Text style={styles.statusText}>{hive.status}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Thermometer size={24} color={colors.primary} />
          <Text style={styles.metricValue}>{hive.temperature}°C</Text>
          <Text style={styles.metricLabel}>Temperature</Text>
        </View>

        <View style={styles.metric}>
          <Droplets size={24} color={colors.primary} />
          <Text style={styles.metricValue}>{hive.humidity}%</Text>
          <Text style={styles.metricLabel}>Humidity</Text>
        </View>

        <View style={styles.metric}>
          <Scale size={24} color={colors.primary} />
          <Text style={styles.metricValue}>{hive.weight}kg</Text>
          <Text style={styles.metricLabel}>Weight</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    textTransform: 'capitalize',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});