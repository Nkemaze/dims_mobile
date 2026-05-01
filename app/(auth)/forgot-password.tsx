import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  const handleModalOk = () => {
    setSent(false);
    router.push({ pathname: '/(auth)/verify-code' as any, params: { email } });
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={false} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Reset Password" showBack />
        <View style={styles.body}>
          <Text style={styles.heading}>Forgot your password?</Text>
          <Text style={styles.sub}>
            Enter your email address and we&apos;ll send you a 6-digit reset code.
          </Text>
          <AppInput
            label="Email Address"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AppButton title="Send Reset Code" onPress={handleSubmit} isLoading={isLoading} />
        </View>

        <Modal visible={sent} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Check your email ✉️</Text>
              <Text style={styles.modalText}>
                An email has been sent to {email || 'your email'} with a 6-digit reset code.
              </Text>
              <AppButton title="OK" onPress={handleModalOk} style={styles.modalBtn} />
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
    flex: 1
  },
  body: {
    marginTop: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
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
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
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
  modalBtn: {
    width: '100%',
  }
});
