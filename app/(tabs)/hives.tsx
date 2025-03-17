import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { Thermometer, Droplets, Scale, Volume2, Plus, AlertTriangle, RefreshCw } from 'lucide-react-native';

export default function HivesScreen() {
  const router = useRouter();
  const { hives, getApiaryById, isLoading, error, deleteHive } = useBeekeeping();
  
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

  const handleDeleteHive = async (id: string) => {
    Alert.alert(
      'Delete Hive',
      'Are you sure you want to delete this hive? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHive(id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete hive');
            }
          },
        },
      ]
    );
  };

  const [menuVisible, setMenuVisible] = useState<string | null>(null);

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
                  </View>
                  
                  <Text style={styles.apiaryName}>
                    {apiary ? apiary.name : 'No Apiary Assigned'}
                  </Text>
                  
                  <Text style={styles.lastUpdated}>
                    Last updated: {formatDate(hive.lastUpdated)}
                  </Text>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => navigateToHiveDetails(hive.id)}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.optionsButton}
                      onPress={() => setMenuVisible(hive.id)}
                    >
                      <Text style={styles.optionsButtonText}>•••</Text>
                    </TouchableOpacity>
                    {menuVisible === hive.id && (
                      <View style={styles.optionsMenu}>
                        <TouchableOpacity 
                          style={styles.menuItem}
                          onPress={() => {
                            setMenuVisible(null);
                            handleDeleteHive(hive.id);
                          }}
                        >
                          <Text style={styles.menuItemText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
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
  apiaryName: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    flex: 1,
  },
  detailsButtonText: {
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsButton: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.sm,
    borderRadius: 8,
    width: 40,
  },
  optionsButtonText: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsMenu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  menuItem: {
    padding: spacing.sm,
  },
  menuItemText: {
    color: colors.text,
  },
});
