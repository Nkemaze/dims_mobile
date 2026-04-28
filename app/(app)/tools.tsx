import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

export default function ToolsScreen() {
  return (
    <SafeLayout>
      <ScreenHeader title="Tools" showBell showSearch />
      <View style={styles.container}>
        <Ionicons name="build" size={100} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.title}>You have no tools available for now</Text>
        <Text style={styles.subtitle}>Check back later for new tools and features.</Text>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  icon: {
    opacity: 0.2,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
