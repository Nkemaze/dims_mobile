import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(app)/dashboard' as any);
  };

  return (
    <SafeLayout scrollable={false} contentStyle={styles.container}>
      {/* Branding */}
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>DIMS</Text>
        </View>
        <Text style={styles.title}>DigiMark Internship Management System</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>
        <Text style={styles.subheading}>Enter your credentials to continue</Text>

        <AppInput
          label="Email"
          placeholder="Enter your email"
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

        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AppButton title="LOGIN" onPress={handleLogin} style={styles.loginBtn} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    flex: 1,
  },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  signupText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
