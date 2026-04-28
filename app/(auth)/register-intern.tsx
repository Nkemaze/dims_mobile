import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function RegisterInternScreen() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View
          key={s}
          style={[
            styles.stepDot,
            s <= step ? styles.stepDotActive : styles.stepDotInactive
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeLayout>
      <ScreenHeader title="Intern Registration" showBack />

      <ScrollView contentContainerStyle={styles.container}>
        {renderStepIndicator()}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <AppInput label="Full Name" placeholder="Enter your full name" />
            <AppInput label="Email" placeholder="Enter your email" keyboardType="email-address" />
            <AppInput label="Phone Number" placeholder="Enter your phone number" keyboardType="phone-pad" />
            <AppButton title="Next Step" onPress={nextStep} />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Academic Details</Text>
            <AppInput label="University / Institute" placeholder="Enter your university" />
            <AppInput label="Major / Course" placeholder="Enter your major" />
            <AppInput label="Year of Study" placeholder="e.g., 3rd Year" />
            <View style={styles.btnRow}>
              <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
              <AppButton title="Next Step" onPress={nextStep} style={styles.halfBtn} />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Security</Text>
            <AppInput label="Password" placeholder="Create a password" isPassword />
            <AppInput label="Confirm Password" placeholder="Confirm your password" isPassword />
            <View style={styles.btnRow}>
              <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
              <AppButton title="Complete Registration" onPress={() => router.replace('/(auth)/login')} style={styles.halfBtn} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  stepDotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  stepContainer: {
    gap: SPACING.sm,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  halfBtn: {
    flex: 1,
  }
});
