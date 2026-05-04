import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, RADIUS, SPACING, FONTS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, ActivityIndicator, Modal } from 'react-native';

const logo = require('../../assets/images/dims.png');

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [modalConfig, setModalConfig] = React.useState({
    visible: false,
    title: '',
    message: '',
    actions: [] as { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]
  });
  const router = useRouter();

  const { login, isLoading, error, clearError } = useAuthStore();

  const showModal = (title: string, message: string, actions?: { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]) => {
    setModalConfig({
      visible: true,
      title,
      message,
      actions: actions || [{ text: 'OK', onPress: () => setModalConfig(prev => ({ ...prev, visible: false })), variant: 'primary' }]
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Error', 'Please enter both email and password');
      return;
    }

    const result = await login(email, password);

    if (result.isVerified === false) {
      showModal(
        'Account Unverified',
        result.message || 'Your account is not verified. Please check your email for the verification code.',
        [
          { text: 'Cancel', onPress: () => setModalConfig(prev => ({ ...prev, visible: false })), variant: 'outline' },
          { 
            text: 'Verify Now', 
            onPress: () => {
              setModalConfig(prev => ({ ...prev, visible: false }));
              router.push({
                pathname: '/(auth)/verify-code',
                params: { email }
              });
            }, 
            variant: 'primary' 
          }
        ]
      );
      return;
    }

    if (result.success) {
      router.replace('/(app)/dashboard');
    } else {
      showModal('Login Failed', result.message || 'Invalid credentials');
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
            title="LOGIN"
            onPress={handleLogin}
            style={styles.loginBtn}
            disabled={isLoading}
            isLoading={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Looking for an internship? </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://internship.digimarkconsulting.cm/internships')}>
              <Text style={styles.signupText}>Apply Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={modalConfig.visible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
              <Text style={styles.modalText}>{modalConfig.message}</Text>
              <View style={styles.modalActions}>
                {modalConfig.actions.map((action, index) => (
                  <AppButton
                    key={index}
                    title={action.text}
                    onPress={action.onPress}
                    variant={action.variant || 'primary'}
                    style={styles.modalBtn}
                  />
                ))}
              </View>
            </View>
          </View>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  modalText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.md,
  },
  modalBtn: {
    flex: 1,
  }
});
