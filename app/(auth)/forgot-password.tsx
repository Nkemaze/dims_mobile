import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <SafeLayout scrollable={false} contentStyle={styles.container}>
      <ScreenHeader title="Reset Password" showBack />
      <View style={styles.body}>
        {sent ? (
          <>
            <Text style={styles.heading}>Check your email ✉️</Text>
            <Text style={styles.sub}>
              A password reset link has been sent to {email}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Forgot your password?</Text>
            <Text style={styles.sub}>
              Enter your email address and we&apos;ll send you a reset link.
            </Text>
            <AppInput
              label="Email Address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <AppButton title="Send Reset Link" onPress={handleSubmit} isLoading={isLoading} />
          </>
        )}
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: SPACING.md, gap: SPACING.md },
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
});
