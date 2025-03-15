import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Bell, Thermometer, Droplets, Scale, User, Lock, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';

const SECTIONS = [
  {
    title: 'Notifications',
    items: [
      {
        icon: Bell,
        label: 'Push Notifications',
        type: 'switch',
        value: true,
      },
      {
        icon: Thermometer,
        label: 'Temperature Alerts',
        type: 'switch',
        value: true,
      },
      {
        icon: Droplets,
        label: 'Humidity Alerts',
        type: 'switch',
        value: true,
      },
      {
        icon: Scale,
        label: 'Weight Alerts',
        type: 'switch',
        value: true,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        icon: User,
        label: 'Profile Settings',
        type: 'link',
      },
      {
        icon: Lock,
        label: 'Security',
        type: 'link',
      },
      {
        icon: HelpCircle,
        label: 'Help & Support',
        type: 'link',
      },
      {
        icon: LogOut,
        label: 'Log Out',
        type: 'button',
        color: colors.danger,
      },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <Pressable
              key={item.label}
              style={styles.settingItem}
              onPress={() => {
                if (item.type === 'link' || item.type === 'button') {
                  // Handle navigation or action
                }
              }}>
              <View style={styles.settingLeft}>
                <item.icon
                  size={24}
                  color={item.color || colors.primary}
                  style={styles.settingIcon}
                />
                <Text
                  style={[
                    styles.settingLabel,
                    item.color && { color: item.color },
                  ]}>
                  {item.label}
                </Text>
              </View>
              {item.type === 'switch' && (
                <Switch
                  value={item.value}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              )}
            </Pressable>
          ))}
        </View>
      ))}
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
  section: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
});