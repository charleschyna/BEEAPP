import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Switch } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';

interface AddInspectionModalProps {
  visible: boolean;
  hiveId: string;
  onClose: () => void;
}

export function AddInspectionModal({ visible, hiveId, onClose }: AddInspectionModalProps) {
  const { addInspectionLog } = useBeekeeping();
  
  const [date, setDate] = useState(new Date().toISOString());
  const [queenSpotted, setQueenSpotted] = useState(false);
  const [broodPatterns, setBroodPatterns] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [honeyStores, setHoneyStores] = useState<'abundant' | 'good' | 'fair' | 'low'>('good');
  const [pollenStores, setPollenStores] = useState<'abundant' | 'adequate' | 'good' | 'fair' | 'low'>('good');
  const [diseasesSigns, setDiseasesSigns] = useState(false);
  const [diseasesNotes, setDiseasesNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [actions, setActions] = useState<string[]>([]);
  const [newAction, setNewAction] = useState('');

  const broodPatternOptions: ('excellent' | 'good' | 'fair' | 'poor')[] = ['excellent', 'good', 'fair', 'poor'];
  const honeyStoreOptions: ('abundant' | 'good' | 'fair' | 'low')[] = ['abundant', 'good', 'fair', 'low'];
  const pollenStoreOptions: ('abundant' | 'adequate' | 'good' | 'fair' | 'low')[] = ['abundant', 'adequate', 'good', 'fair', 'low'];
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!notes.trim()) {
      newErrors.notes = 'Notes are required';
    }
    
    if (diseasesSigns && !diseasesNotes.trim()) {
      newErrors.diseasesNotes = 'Please provide details about disease signs';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAction = () => {
    if (newAction.trim()) {
      setActions([...actions, newAction.trim()]);
      setNewAction('');
    }
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    addInspectionLog({
      hiveId,
      date,
      queenSpotted,
      broodPatterns,
      honeyStores,
      pollenStores,
      diseasesSigns,
      diseasesNotes: diseasesSigns ? diseasesNotes : '',
      notes,
      actions,
    });
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date().toISOString());
    setQueenSpotted(false);
    setBroodPatterns('good');
    setHoneyStores('good');
    setPollenStores('good');
    setDiseasesSigns(false);
    setDiseasesNotes('');
    setNotes('');
    setActions([]);
    setNewAction('');
    setErrors({});
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
            <Text style={styles.modalTitle}>Add Inspection Log</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.dateDisplay}>
                {format(new Date(date), 'MMMM d, yyyy h:mm a')}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Queen Spotted</Text>
                <Switch
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.border}
                  onValueChange={setQueenSpotted}
                  value={queenSpotted}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Brood Patterns</Text>
              <View style={styles.optionsContainer}>
                {broodPatternOptions.map(option => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      broodPatterns === option && styles.selectedOption
                    ]}
                    onPress={() => setBroodPatterns(option as 'excellent' | 'good' | 'fair' | 'poor')}
                  >
                    <Text style={[
                      styles.optionText,
                      broodPatterns === option && styles.selectedOptionText
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Honey Stores</Text>
              <View style={styles.optionsContainer}>
                {honeyStoreOptions.map(option => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      honeyStores === option && styles.selectedOption
                    ]}
                    onPress={() => setHoneyStores(option as 'abundant' | 'good' | 'fair' | 'low')}
                  >
                    <Text style={[
                      styles.optionText,
                      honeyStores === option && styles.selectedOptionText
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Pollen Stores</Text>
              <View style={styles.optionsContainer}>
                {pollenStoreOptions.map(option => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      pollenStores === option && styles.selectedOption
                    ]}
                    onPress={() => setPollenStores(option as 'abundant' | 'adequate' | 'good' | 'fair' | 'low')}
                  >
                    <Text style={[
                      styles.optionText,
                      pollenStores === option && styles.selectedOptionText
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Disease Signs</Text>
                <Switch
                  trackColor={{ false: colors.border, true: colors.danger }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.border}
                  onValueChange={setDiseasesSigns}
                  value={diseasesSigns}
                />
              </View>
              
              {diseasesSigns && (
                <View style={styles.nestedInput}>
                  <TextInput
                    style={[styles.input, errors.diseasesNotes && styles.inputError]}
                    value={diseasesNotes}
                    onChangeText={setDiseasesNotes}
                    placeholder="Describe disease signs..."
                    multiline
                    numberOfLines={3}
                  />
                  {errors.diseasesNotes && (
                    <Text style={styles.errorText}>{errors.diseasesNotes}</Text>
                  )}
                </View>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.notes && styles.inputError]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter detailed notes about the inspection..."
                multiline
                numberOfLines={4}
              />
              {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Actions Taken</Text>
              
              <View style={styles.actionInputContainer}>
                <TextInput
                  style={[styles.input, styles.actionInput]}
                  value={newAction}
                  onChangeText={setNewAction}
                  placeholder="Add action taken..."
                />
                <Pressable style={styles.addActionButton} onPress={handleAddAction}>
                  <Plus size={20} color={colors.white} />
                </Pressable>
              </View>
              
              {actions.length > 0 && (
                <View style={styles.actionsList}>
                  {actions.map((action, index) => (
                    <View key={index} style={styles.actionItem}>
                      <Text style={styles.actionText}>{action}</Text>
                      <Pressable 
                        onPress={() => handleRemoveAction(index)}
                        style={styles.removeActionButton}
                      >
                        <Trash2 size={18} color={colors.danger} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>Save Inspection</Text>
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
  dateDisplay: {
    ...typography.body,
    color: colors.text,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    ...typography.body,
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 4,
  },
  nestedInput: {
    marginTop: spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  actionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  addActionButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsList: {
    marginTop: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  removeActionButton: {
    padding: 4,
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
