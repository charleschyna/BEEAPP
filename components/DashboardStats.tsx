import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { Database, Grid3x3 } from 'lucide-react-native';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.statsTextContainer}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsLabel}>{label}</Text>
      </View>
    </View>
  );
}

export function DashboardStats({ onAddApiaryPress }: { onAddApiaryPress: () => void }) {
  const { getTotalApiaries, getTotalHives } = useBeekeeping();

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <StatsCard 
          icon={<Database size={24} color={colors.primary} />}
          label="Apiaries"
          value={getTotalApiaries()}
        />
        <StatsCard 
          icon={<Grid3x3 size={24} color={colors.primary} />}
          label="Hives"
          value={getTotalHives()}
        />
      </View>
      
      <Pressable 
        style={styles.addButton}
        onPress={onAddApiaryPress}
      >
        <Text style={styles.addButtonText}>Add New Apiary</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: colors.primaryLight + '20', // 20% opacity
    borderRadius: 12,
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  statsTextContainer: {
    flex: 1,
  },
  statsValue: {
    ...typography.h2,
    color: colors.text,
  },
  statsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.body,
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
});
