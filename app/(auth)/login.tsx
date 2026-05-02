import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
const logo = require('../../assets/images/dims.png')

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();


  const handleLogin = () => {
    router.replace('/(app)/dashboard' as any);
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
            style={{ width: 150, height: 150}}
          />
          <Text style={styles.title}>DigiMark Internship Management System</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',

  },
  heading: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    color: COLORS.primary,
    fontSize: 16,
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
