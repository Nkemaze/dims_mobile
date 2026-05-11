import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING, RADIUS  } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { token, email } = useLocalSearchParams();

  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Invalid Access',
        'Missing reset token. Please request a new reset code.',
        [{ text: 'Go Back', onPress: () => router.replace('/(auth)/forgot-password') }]
      );
    }
    return () => clearError();
  }, [token, clearError, router]);

  const handleReset = async () => {
    // Validation
    if (!password || !confirmPassword) {
      Alert.alert('Validation Error', 'Both password fields are required.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Security Requirement', 'Your new password must be at least 8 characters long for better security.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'The passwords you entered do not match. Please re-type them.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Reset token is missing. Please try the process again.');
      return;
    }

    // API Call
    try {
      const result = await resetPassword(token as string, password);

      if (result.success) {
        Alert.alert(
          'Success!',
          'Your password has been reset successfully. You can now log in with your new credentials.',
          [{ text: 'Log In Now', onPress: () => router.replace('/(auth)/login') }]
        );
      } else {
        // This handles cases where the API returns success: false with a message
        Alert.alert('Reset Failed', result.message || 'We could not reset your password at this time. Please check your internet connection or try again later.');
      }
    } catch (err: any) {
      // General error handling if the store doesn't catch it
      Alert.alert('An Unexpected Error Occurred', err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={true} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Create New Password" showBack />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.body}>
            <Text style={styles.heading}>New Credentials</Text>
            <Text style={styles.sub}>
              Resetting password for: <Text style={styles.emailHighlight}>{email || 'your account'}</Text>
            </Text>
            <Text style={styles.instruction}>
              Please enter your new password below. Make sure it is strong and unique.
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <AppInput
              label="New Password"
              placeholder="Enter at least 8 characters"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
              }}
            />

            <AppInput
              label="Confirm New Password"
              placeholder="Repeat your new password"
              isPassword
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) clearError();
              }}
            />

            <AppButton
              title="UPDATE PASSWORD"
              onPress={handleReset}
              isLoading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </SafeLayout>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: { 
    flex: 1 
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  body: { 
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: SPACING.md,
  },
  heading: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  instruction: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
});
