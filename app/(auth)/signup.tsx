import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignupTypeScreen() {
  const router = useRouter();

  return (
    <SafeLayout>
      <ScreenHeader title="Sign Up" showBack />

      <View style={styles.container}>
        <Text style={styles.heading}>Choose your account type</Text>
        <Text style={styles.subheading}>Select how you want to use the DIMS portal</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push('/(auth)/register-intern' as any)}
          >
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="school" size={32} color={COLORS.white} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Join as an Intern</Text>
              <Text style={styles.optionDescription}>Apply for internships and manage your tasks</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => {}}
          >
            <View style={[styles.iconCircle, { backgroundColor: COLORS.secondary }]}>
              <Ionicons name="briefcase" size={32} color={COLORS.white} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Join as a Supervisor</Text>
              <Text style={styles.optionDescription}>Manage interns and assign tasks</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
