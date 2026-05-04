import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    actions: [] as { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]
  });

  const router = useRouter();
  const { token, email } = useLocalSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  // ── Modal helper ──────────────────────────────────────────
  const showModal = (
    title: string,
    message: string,
    actions?: { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]
  ) => {
    setModalConfig({
      visible: true,
      title,
      message,
      actions: actions || [{
        text: 'OK',
        onPress: () => setModalConfig(prev => ({ ...prev, visible: false })),
        variant: 'primary'
      }]
    });
  };

  const closeModal = () => setModalConfig(prev => ({ ...prev, visible: false }));

  // ── Guard: no token ───────────────────────────────────────
  useEffect(() => {
    if (!token) {
      showModal(
        'Invalid Access',
        'Missing reset token. Please request a new reset code.',
        [{
          text: 'Go Back',
          onPress: () => router.replace('/(auth)/forgot-password'),
          variant: 'primary'
        }]
      );
    }
    return () => clearError();
  }, [token, clearError, router]);

  // ── Submit ────────────────────────────────────────────────
  const handleReset = async () => {
    if (!password || !confirmPassword) {
      showModal('Validation Error', 'Both password fields are required.');
      return;
    }

    if (password.length < 8) {
      showModal('Security Requirement', 'Your new password must be at least 8 characters long for better security.');
      return;
    }

    if (password !== confirmPassword) {
      showModal('Mismatch', 'The passwords you entered do not match. Please re-type them.');
      return;
    }

    if (!token) {
      showModal('Error', 'Reset token is missing. Please try the process again.');
      return;
    }

    try {
      const result = await resetPassword(token as string, password);

      if (result.success) {
        showModal(
          'Success!',
          result.message || 'Your password has been reset successfully. You can now log in with your new credentials.',
          [{
            text: 'Log In Now',
            onPress: () => router.replace('/(auth)/login'),
            variant: 'primary'
          }]
        );
      } else {
        showModal(
          'Reset Failed',
          result.message || 'We could not reset your password. Please try again.'
        );
      }
    } catch (err: any) {
      showModal('Unexpected Error', err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={true} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Create New Password" showBack />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.body}>
            <Text style={styles.heading}>New Credentials</Text>
            <Text style={styles.sub}>
              Resetting password for:{' '}
              <Text style={styles.emailHighlight}>{email || 'your account'}</Text>
            </Text>
            <Text style={styles.instruction}>
              Please enter your new password below. Make sure it is strong and unique.
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <AppInput
              label="New Password"
              placeholder="Enter at least 8 characters"
              isPassword
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
              }}
            />

            <AppInput
              label="Confirm New Password"
              placeholder="Repeat your new password"
              isPassword
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) clearError();
              }}
            />

            <AppButton
              title="UPDATE PASSWORD"
              onPress={handleReset}
              isLoading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </SafeLayout>

      {/* ── Modal ── */}
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

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'transparent' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xl },
  gradient: { flex: 1, width: '100%', paddingVertical: SPACING.xl },
  body: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: SPACING.md,
  },
  heading: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  instruction: {
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
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  // ── Modal styles (copied from login) ──
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
  modalBtn: { flex: 1 },
});