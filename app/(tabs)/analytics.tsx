import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { colors, spacing, typography } from '@/constants/theme';

const mockData = {
  temperature: [
    { x: 1, y: 32 }, { x: 2, y: 34 }, { x: 3, y: 35 }, { x: 4, y: 33 },
    { x: 5, y: 34 }, { x: 6, y: 36 }, { x: 7, y: 35 },
  ],
  humidity: [
    { x: 1, y: 65 }, { x: 2, y: 63 }, { x: 3, y: 67 }, { x: 4, y: 65 },
    { x: 5, y: 68 }, { x: 6, y: 64 }, { x: 7, y: 66 },
  ],
  weight: [
    { x: 1, y: 25 }, { x: 2, y: 25.5 }, { x: 3, y: 26 }, { x: 4, y: 26.2 },
    { x: 5, y: 26.8 }, { x: 6, y: 27 }, { x: 7, y: 27.3 },
  ],
};

type MetricType = 'temperature' | 'humidity' | 'weight';

export default function AnalyticsScreen() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');

  const getMetricColor = (metric: MetricType) => {
    switch (metric) {
      case 'temperature':
        return colors.danger;
      case 'humidity':
        return colors.primary;
      case 'weight':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const MetricButton = ({ metric, label }: { metric: MetricType; label: string }) => (
    <Pressable
      style={[
        styles.metricButton,
        selectedMetric === metric && { backgroundColor: getMetricColor(metric) },
      ]}
      onPress={() => setSelectedMetric(metric)}>
      <Text
        style={[
          styles.metricButtonText,
          selectedMetric === metric && styles.metricButtonTextSelected,
        ]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Monitor your hive metrics</Text>
      </View>

      <View style={styles.metricButtons}>
        <MetricButton metric="temperature" label="Temperature" />
        <MetricButton metric="humidity" label="Humidity" />
        <MetricButton metric="weight" label="Weight" />
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} height={300}>
          <VictoryLine
            style={{
              data: { stroke: getMetricColor(selectedMetric) },
            }}
            data={mockData[selectedMetric]}
          />
          <VictoryAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.textSecondary },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.textSecondary },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>34.2°C</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Maximum</Text>
          <Text style={styles.statValue}>36.5°C</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Minimum</Text>
          <Text style={styles.statValue}>32.1°C</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  metricButtons: {
    flexDirection: 'row',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  metricButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  metricButtonText: {
    ...typography.body,
    color: colors.text,
  },
  metricButtonTextSelected: {
    color: colors.white,
  },
  chartContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
});