import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Pressable, Platform, AccessibilityRole } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { MapPin, Plus } from 'lucide-react-native';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { AddApiaryModal } from '@/components/AddApiaryModal';

// Define type for web role
type Role = 'button' | 'link' | 'tab' | 'checkbox' | 'radio' | 'switch';

export default function ApiariesScreen() {
  const { apiaries, setApiaries, fetchApiaries, getHivesByApiaryId } = useBeekeeping();
  const [addApiaryModalVisible, setAddApiaryModalVisible] = useState(false);
  
  useEffect(() => {
    const getApiaries = async () => {
      const fetchedApiaries = await fetchApiaries(); // Fetch apiaries from the database
      setApiaries(fetchedApiaries); // Update local state with fetched apiaries
    };

    getApiaries();
  }, []); // Empty dependency array to run once on mount

  const pressableProps = Platform.select({
    native: {
      accessibilityRole: 'button' as AccessibilityRole,
      accessibilityHint: 'Opens apiary details',
    },
    default: {
      role: 'button' as Role,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apiaries</Text>
        <Text style={styles.subtitle}>Manage your bee yards</Text>
      </View>

      <Pressable 
        style={styles.addButton} 
        {...pressableProps}
        onPress={() => setAddApiaryModalVisible(true)}
      >
        <Plus size={24} color={colors.white} />
        <Text style={styles.addButtonText}>Add New Apiary</Text>
      </Pressable>

      {apiaries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No apiaries yet. Add your first apiary!</Text>
        </View>
      ) : (
        apiaries.map((apiary) => (
          <Pressable key={apiary.id} style={styles.apiaryCard} {...pressableProps}>
            <Image source={{ uri: apiary.imageUrl }} style={styles.apiaryImage} />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.apiaryName}>{apiary.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={colors.white} />
                <Text style={styles.locationText}>{apiary.location}</Text>
              </View>
              <Text style={styles.hiveCount}>{getHivesByApiaryId(apiary.id).length} Hives</Text>
            </View>
          </Pressable>
        ))
      )}
      
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  apiaryCard: {
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  apiaryImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  apiaryName: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  locationText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  hiveCount: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  emptyState: {
    margin: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});