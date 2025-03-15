import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import { colors, spacing } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { fetchApiaries } from '@/services/hiveService';
import { LoadingIndicator } from '@/components/LoadingIndicator';

export default function AddHiveScreen() {
  const router = useRouter();
  const { addHive } = useBeekeeping();

  const [name, setName] = useState('');
  const [apiaryId, setApiaryId] = useState('');
  const [apiaries, setApiaries] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch apiaries when the component mounts
  useEffect(() => {
    const loadApiaries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiaryData = await fetchApiaries();
        setApiaries(apiaryData);
      } catch (err) {
        console.error('Error fetching apiaries:', err);
        setError('Failed to load apiaries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiaries();
  }, []);

  const handleSubmit = async () => {
    // Validate input
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a hive name');
      return;
    }

    if (!apiaryId) {
      Alert.alert('Error', 'Please select an apiary');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Set initial values for a new hive
      await addHive({
        name: name.trim(),
        apiaryId,
        temperature: 34.5, // Default values
        humidity: 55.0,
        weight: 25.0,
        sound: 40.0,
        status: 'healthy',
        lastUpdated: new Date().toISOString(),
      });
      
      // Return to the hives list
      Alert.alert('Success', 'Hive added successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (err) {
      console.error('Error adding hive:', err);
      Alert.alert('Error', 'Failed to add hive. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              const loadApiaries = async () => {
                setIsLoading(true);
                setError(null);
                
                try {
                  const apiaryData = await fetchApiaries();
                  setApiaries(apiaryData);
                } catch (err) {
                  console.error('Error fetching apiaries:', err);
                  setError('Failed to load apiaries. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              };
              
              loadApiaries();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (apiaries.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No apiaries found. Please add an apiary first.</Text>
          <TouchableOpacity 
            style={styles.addApiaryButton} 
            onPress={() => {
              // Navigate to add apiary screen (if implemented)
              Alert.alert('Coming Soon', 'Add Apiary feature is coming soon!');
            }}
          >
            <Text style={styles.addApiaryButtonText}>Add Apiary</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hive Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter hive name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Apiary</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={apiaryId}
              onValueChange={(itemValue: string) => setApiaryId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select an apiary" value="" />
              {apiaries.map((apiary) => (
                <Picker.Item 
                  key={apiary.id} 
                  label={apiary.name} 
                  value={apiary.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Hive</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add New Hive',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <StatusBar style="auto" />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  addApiaryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  addApiaryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});
