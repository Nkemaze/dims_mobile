import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, ActivityIndicator } from 'react-native';

const logo = require('../../assets/images/dims.png');

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const result = await login(email, password);

    if (result.isVerified === false) {
      Alert.alert(
        'Account Unverified',
        result.message || 'Your account is not verified. Please check your email for the verification code.',
        [
          {
            text: 'Verify Now',
            onPress: () => router.push({
              pathname: '/(auth)/verify-code',
              params: { email }
            })
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    if (result.success) {
      router.replace('/(app)/dashboard');
    } else {
      Alert.alert('Login Failed', result.message || 'Invalid credentials');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={true} style={styles.safeArea} contentStyle={styles.container}>
        {/* Branding */}
        <View style={styles.brand}>
          <Image
            source={logo}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>DigiMark Internship Management System</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.subheading}>Enter your credentials to continue</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <AppInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            isPassword
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <AppButton
            title={isLoading ? "" : "LOGIN"}
            onPress={handleLogin}
            style={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading && <ActivityIndicator color={COLORS.white} />}
          </AppButton>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Looking for an internship? </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://internship.digimarkconsulting.cm/internships')}>
              <Text style={styles.signupText}>Apply Here</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  subheading: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: SPACING.lg,
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
    height: 50,
    justifyContent: 'center',
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
