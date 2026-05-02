import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'mtn', name: 'MTN Mobile Money', color: '#ffcc00' },
    { id: 'orange', name: 'ORANGE Money', color: '#ff6600' },
  ];

  return (
    <SafeLayout>
      <ScreenHeader title="Payment" showBack onBackPress={() => router.push('/(app)/profile' as any)} />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.noInfoContainer} id="noPaymentInfoMessage">
          <Ionicons name="information-circle-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.noInfoText}>No previous payment information available.</Text>
        </View>

        <Text style={styles.sectionTitle}>Make a Payment</Text>
        
        <View style={styles.methodsContainer}>
          {paymentMethods.map(method => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity 
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}
              >
                <AppCard style={[
                  styles.methodCard, 
                  isSelected && { borderColor: method.color, borderWidth: 2 }
                ] as any}>
                  <View style={styles.methodContent}>
                    <View style={[styles.radioCircle, isSelected && { borderColor: method.color }]}>
                      {isSelected && <View style={[styles.innerCircle, { backgroundColor: method.color }]} />}
                    </View>
                    <Text style={[styles.methodName, isSelected && { color: method.color, fontWeight: '700' }]}>
                      {method.name}
                    </Text>
                  </View>
                </AppCard>
              </TouchableOpacity>
            )
          })}
        </View>

        <AppButton 
          title="Pay with selected" 
          onPress={() => {}} 
          disabled={!selectedMethod}
          style={[styles.payBtn, !selectedMethod && styles.payBtnDisabled] as any} 
        />
        
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  noInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginTop: SPACING.sm,
  },
  noInfoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  methodsContainer: {
    gap: SPACING.md,
  },
  methodCard: {
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  methodName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  payBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  payBtnDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  }
});
