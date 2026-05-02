import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
  const { token } = useLocalSearchParams();

  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const result = await resetPassword(token as string, password);
    if (result.success) {
      Alert.alert('Success', 'Password reset successfully. You can now login with your new password.', [
        { text: 'Login', onPress: () => router.replace('/(auth)/login') }
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={false} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Create New Password" showBack />
        <View style={styles.body}>
          <Text style={styles.heading}>Enter new password</Text>
          <Text style={styles.sub}>
            Your new password must be different from previous used passwords.
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <AppInput
            label="New Password"
            placeholder="Must be at least 8 characters"
            isPassword
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
          />
          
          <AppInput
            label="Confirm Password"
            placeholder="Both passwords must match"
            isPassword
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) clearError();
            }}
          />
          
          <AppButton title="Reset Password" onPress={handleReset} isLoading={isLoading} />
        </View>
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
  body: { 
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  sub: {
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
  },
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
});
