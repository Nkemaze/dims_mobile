import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING, RADIUS  } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Let's assume verification is successful. We navigate back to login.
      router.replace('/(auth)/login');
    }, 1500);
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
          
          <AppInput
            label="New Password"
            placeholder="Must be at least 8 characters"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          
          <AppInput
            label="Confirm Password"
            placeholder="Both passwords must match"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
});
