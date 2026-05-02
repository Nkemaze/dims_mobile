import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { email, type } = useLocalSearchParams();

  const { verifyEmail, isLoading, error, clearError } = useAuthStore();

  const handleVerify = async () => {
    if (code.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    if (type === 'reset') {
      // For password reset, the code IS the token for the next step
      router.replace({
        pathname: '/(auth)/reset-password',
        params: { email, token: code }
      });
    } else {
      const result = await verifyEmail(code);
      if (result.success) {
        Alert.alert('Success', result.message, [
          { text: 'Login', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        Alert.alert('Verification Failed', result.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={false} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Verify Code" showBack />
        <View style={styles.body}>
          <Text style={styles.heading}>Enter 6-digit code</Text>
          <Text style={styles.sub}>
            We&apos;ve sent an email with a verification code to {email || 'your email'}.
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Verification Code"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (error) clearError();
            }}
            style={styles.codeInput}
          />
          <AppButton title="Verify Code" onPress={handleVerify} isLoading={isLoading} />
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
  codeInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
});
