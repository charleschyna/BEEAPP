import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { Hive } from '@/context/BeekeepingContext';
import { X } from 'lucide-react-native';

interface EditHiveModalProps {
  visible: boolean;
  hive: Hive;
  onClose: () => void;
}

export function EditHiveModal({ visible, hive, onClose }: EditHiveModalProps) {
  const { updateHive, apiaries } = useBeekeeping();
  
  const [name, setName] = useState(hive.name);
  const [apiaryId, setApiaryId] = useState(hive.apiaryId);
  const [temperature, setTemperature] = useState(hive.temperature.toString());
  const [humidity, setHumidity] = useState(hive.humidity.toString());
  const [weight, setWeight] = useState(hive.weight.toString());
  const [sound, setSound] = useState(hive.sound?.toString() || '');
  const [status, setStatus] = useState<'healthy' | 'warning' | 'danger'>(hive.status);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!apiaryId) newErrors.apiaryId = 'Apiary is required';
    
    if (!temperature.trim() || isNaN(Number(temperature))) {
      newErrors.temperature = 'Valid temperature is required';
    }
    
    if (!humidity.trim() || isNaN(Number(humidity))) {
      newErrors.humidity = 'Valid humidity is required';
    }
    
    if (!weight.trim() || isNaN(Number(weight))) {
      newErrors.weight = 'Valid weight is required';
    }
    
    if (sound.trim() && isNaN(Number(sound))) {
      newErrors.sound = 'Sound must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const updatedHive: Hive = {
      ...hive,
      name,
      apiaryId,
      temperature: Number(temperature),
      humidity: Number(humidity),
      weight: Number(weight),
      sound: sound ? Number(sound) : undefined,
      status,
      lastUpdated: new Date().toISOString()
    };
    
    updateHive(updatedHive);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Hive</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hive Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="Enter hive name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Apiary</Text>
              <View style={styles.apiarySelector}>
                {apiaries.map(apiary => (
                  <Pressable
                    key={apiary.id}
                    style={[
                      styles.apiaryOption,
                      apiaryId === apiary.id && styles.selectedApiaryOption
                    ]}
                    onPress={() => setApiaryId(apiary.id)}
                  >
                    <Text 
                      style={[
                        styles.apiaryOptionText,
                        apiaryId === apiary.id && styles.selectedApiaryOptionText
                      ]}
                    >
                      {apiary.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.apiaryId && <Text style={styles.errorText}>{errors.apiaryId}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusSelector}>
                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'healthy' && styles.selectedStatusOption,
                    { backgroundColor: status === 'healthy' ? colors.success : 'transparent' }
                  ]}
                  onPress={() => setStatus('healthy')}
                >
                  <Text 
                    style={[
                      styles.statusOptionText,
                      status === 'healthy' && styles.selectedStatusOptionText
                    ]}
                  >
                    Healthy
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'warning' && styles.selectedStatusOption,
                    { backgroundColor: status === 'warning' ? colors.warning : 'transparent' }
                  ]}
                  onPress={() => setStatus('warning')}
                >
                  <Text 
                    style={[
                      styles.statusOptionText,
                      status === 'warning' && styles.selectedStatusOptionText
                    ]}
                  >
                    Warning
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'danger' && styles.selectedStatusOption,
                    { backgroundColor: status === 'danger' ? colors.danger : 'transparent' }
                  ]}
                  onPress={() => setStatus('danger')}
                >
                  <Text 
                    style={[
                      styles.statusOptionText,
                      status === 'danger' && styles.selectedStatusOptionText
                    ]}
                  >
                    Danger
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.metricsContainer}>
              <Text style={styles.sectionTitle}>Hive Metrics</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Temperature (°C)</Text>
                <TextInput
                  style={[styles.input, errors.temperature && styles.inputError]}
                  value={temperature}
                  onChangeText={setTemperature}
                  placeholder="Temperature in °C"
                  keyboardType="numeric"
                />
                {errors.temperature && <Text style={styles.errorText}>{errors.temperature}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Humidity (%)</Text>
                <TextInput
                  style={[styles.input, errors.humidity && styles.inputError]}
                  value={humidity}
                  onChangeText={setHumidity}
                  placeholder="Humidity in %"
                  keyboardType="numeric"
                />
                {errors.humidity && <Text style={styles.errorText}>{errors.humidity}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, errors.weight && styles.inputError]}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Weight in kg"
                  keyboardType="numeric"
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Sound Level (dB) - Optional</Text>
                <TextInput
                  style={[styles.input, errors.sound && styles.inputError]}
                  value={sound}
                  onChangeText={setSound}
                  placeholder="Sound level in dB"
                  keyboardType="numeric"
                />
                {errors.sound && <Text style={styles.errorText}>{errors.sound}</Text>}
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalContent: {
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    ...typography.body,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 4,
  },
  apiarySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  apiaryOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  selectedApiaryOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  apiaryOptionText: {
    ...typography.body,
    color: colors.text,
  },
  selectedApiaryOptionText: {
    color: colors.white,
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  selectedStatusOption: {
    borderColor: 'transparent',
  },
  statusOptionText: {
    ...typography.body,
    color: colors.text,
  },
  selectedStatusOptionText: {
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metricsContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
});
