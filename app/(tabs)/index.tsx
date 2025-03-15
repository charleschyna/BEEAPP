import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { HiveCard } from '@/components/HiveCard';
import { DashboardStats } from '@/components/DashboardStats';
import { AddApiaryModal } from '@/components/AddApiaryModal';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { LogoImage } from '@/components/LogoImage';

export default function DashboardScreen() {
  const { hives, apiaries } = useBeekeeping();
  const [addApiaryModalVisible, setAddApiaryModalVisible] = useState(false);

  const handleAddApiaryPress = () => {
    setAddApiaryModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <LogoImage size="medium" />
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Beekeeping overview</Text>
      </View>

      {/* Dashboard stats section */}
      <DashboardStats onAddApiaryPress={handleAddApiaryPress} />

      {/* Apiaries section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Apiaries</Text>
        {apiaries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No apiaries yet. Add your first apiary!</Text>
          </View>
        ) : (
          <View style={styles.apiaryList}>
            {apiaries.map(apiary => (
              <View key={apiary.id} style={styles.apiaryItem}>
                <Text style={styles.apiaryName}>{apiary.name}</Text>
                <Text style={styles.apiaryLocation}>{apiary.location}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Recent hives section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Hive Activity</Text>
        <View style={styles.content}>
          {hives.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hives yet.</Text>
            </View>
          ) : (
            hives.slice(0, 3).map((hive) => (
              <HiveCard key={hive.id} hive={hive} />
            ))
          )}
        </View>
      </View>

      {/* Add Apiary Modal */}
      <AddApiaryModal 
        visible={addApiaryModalVisible} 
        onClose={() => setAddApiaryModalVisible(false)} 
      />
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
    alignItems: 'center',
    borderBottomWidth: 1,
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
  section: {
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  content: {
    padding: spacing.sm,
  },
  apiaryList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  apiaryItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  apiaryName: {
    ...typography.h3,
    color: colors.text,
  },
  apiaryLocation: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});