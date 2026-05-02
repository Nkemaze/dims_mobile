import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import {  COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Verification successful. Navigate to reset password.
      router.replace({ pathname: '/(auth)/reset-password' as any, params: { email } });
    }, 1500);
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
          <AppInput
            label="Verification Code"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
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
