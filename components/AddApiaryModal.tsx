import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { useBeekeeping } from '@/context/BeekeepingContext';
import { X } from 'lucide-react-native';
 
interface AddApiaryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddApiaryModal({ visible, onClose }: AddApiaryModalProps) {
  const { addApiary } = useBeekeeping();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (name.trim() && location.trim()) {
      addApiary({
        name: name.trim(),
        location: location.trim(),
        imageUrl: 'https://images.unsplash.com/photo-1587236317816-56161f5ee7e6?auto=format&fit=crop&q=80&w=800'
      });
      
      // Reset form and close modal
      setName('');
      setLocation('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Apiary</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Apiary Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter apiary name"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Pressable
              style={[
                styles.submitButton,
                (!name.trim() || !location.trim()) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim() || !location.trim()}
            >
              <Text style={styles.submitButtonText}>Create Apiary</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    ...typography.body,
    color: colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
});
