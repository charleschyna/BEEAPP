import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { Thermometer, Droplets, Scale, Volume2, Plus, AlertTriangle, RefreshCw } from 'lucide-react-native';

export default function HivesScreen() {
  const router = useRouter();
  const { hives, getApiaryById, isLoading, error } = useBeekeeping();
  
  const getStatusColor = (status: 'healthy' | 'warning' | 'danger') => {
    switch(status) {
      case 'healthy': return colors.success;
      case 'warning': return colors.warning;
      case 'danger': return colors.danger;
      default: return colors.text;
    }
  };
  
  const navigateToHiveDetails = (id: string) => {
    router.push(`/hive/${id}`);
  };
  
  const navigateToAddHive = () => {
    router.push('/add-hive');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Hives",
          headerTitleStyle: styles.headerTitleStyle,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>All Hives</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={navigateToAddHive}
          >
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add Hive</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading hive data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => window.location.reload()}
            >
              <RefreshCw size={16} color={colors.white} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : hives.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hives yet. Add your first hive!</Text>
          </View>
        ) : (
          <View style={styles.hivesContainer}>
            {hives.map((hive) => {
              const apiary = getApiaryById(hive.apiaryId);
              return (
                <Pressable 
                  key={hive.id} 
                  style={styles.hiveCard}
                  onPress={() => navigateToHiveDetails(hive.id)}
                >
                  <View style={styles.hiveHeader}>
                    <Text style={styles.hiveName}>{hive.name}</Text>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(hive.status) }]}>
                      {hive.status !== 'healthy' && <AlertTriangle size={14} color={colors.white} />}
                      <Text style={styles.statusText}>
                        {hive.status.charAt(0).toUpperCase() + hive.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.apiaryName}>
                    {apiary ? apiary.name : 'Unknown Apiary'}
                  </Text>
                  
                  <View style={styles.metricsContainer}>
                    <View style={styles.metricItem}>
                      <Thermometer size={16} color={colors.primary} />
                      <Text style={styles.metricValue}>{hive.temperature}°C</Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Droplets size={16} color={colors.primary} />
                      <Text style={styles.metricValue}>{hive.humidity}%</Text>
                    </View>
                    
                    <View style={styles.metricItem}>
                      <Scale size={16} color={colors.primary} />
                      <Text style={styles.metricValue}>{hive.weight} kg</Text>
                    </View>
                    
                    {hive.sound && (
                      <View style={styles.metricItem}>
                        <Volume2 size={16} color={colors.primary} />
                        <Text style={styles.metricValue}>{hive.sound} dB</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.lastUpdated}>
                    Last updated: {formatDate(hive.lastUpdated)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitleStyle: {
    ...typography.h3,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  hivesContainer: {
    marginTop: spacing.sm,
  },
  hiveCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hiveName: {
    ...typography.h3,
    color: colors.text,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 2,
  },
  apiaryName: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  metricValue: {
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  }
});
