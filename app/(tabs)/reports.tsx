import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FileText, Download, Calendar } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';

const mockReports = [
  {
    id: '1',
    title: 'Monthly Performance Report',
    date: 'October 2025',
    type: 'Monthly',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Weekly Inspection Summary',
    date: 'Oct 15-21, 2025',
    type: 'Weekly',
    size: '1.1 MB',
  },
  {
    id: '3',
    title: 'Harvest Report',
    date: 'October 18, 2025',
    type: 'Special',
    size: '856 KB',
  },
];

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>View and download reports</Text>
      </View>

      <View style={styles.generateSection}>
        <Text style={styles.sectionTitle}>Generate New Report</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.generateButton}>
            <Calendar size={24} color={colors.white} />
            <Text style={styles.generateButtonText}>Monthly</Text>
          </Pressable>
          <Pressable style={styles.generateButton}>
            <Calendar size={24} color={colors.white} />
            <Text style={styles.generateButtonText}>Weekly</Text>
          </Pressable>
          <Pressable style={styles.generateButton}>
            <Calendar size={24} color={colors.white} />
            <Text style={styles.generateButtonText}>Custom</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {mockReports.map((report) => (
          <Pressable key={report.id} style={styles.reportCard}>
            <View style={styles.reportInfo}>
              <FileText size={24} color={colors.primary} />
              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDate}>{report.date}</Text>
              </View>
            </View>
            <View style={styles.reportMeta}>
              <Text style={styles.reportType}>{report.type}</Text>
              <Text style={styles.reportSize}>{report.size}</Text>
              <Download size={20} color={colors.primary} />
            </View>
          </Pressable>
        ))}
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
  generateSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  generateButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  generateButtonText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  recentSection: {
    padding: spacing.md,
  },
  reportCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportDetails: {
    marginLeft: spacing.md,
  },
  reportTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reportDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportType: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  reportSize: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
});