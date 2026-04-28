import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Replace with real auth logic when backend is ready
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(app)/dashboard' as any);
  };

  return (
    <SafeLayout scrollable={false} contentStyle={styles.container}>
      {/* Logo / Branding */}
      <View style={styles.brand}>
        <Text style={styles.logo}>DIMS</Text>
        <Text style={styles.tagline}>Intern Portal</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.heading}>Welcome back 👋</Text>
        <Text style={styles.subheading}>Sign in to your intern account</Text>

        <AppInput
          label="Email Address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <AppButton title="Sign In" onPress={handleLogin} />

        <AppButton
          title="Forgot Password?"
          variant="ghost"
          onPress={() => router.push('/(auth)/forgot-password')}
        />
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.xs,
  },
  form: {
    gap: SPACING.sm,
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subheading: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.md,
  },
  errorBanner: {
    backgroundColor: `${COLORS.error}22`,
    color: COLORS.error,
    padding: SPACING.md,
    borderRadius: 8,
    fontSize: FONTS.sizes.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
});
