import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function PermissionsScreen() {
  const router = useRouter();

  const dummyPermissions = [
    { id: '1', reason: 'Medical checkup and dentist appointment', from: '10/11/2026', to: '11/11/2026', status: 'approved' },
    { id: '2', reason: 'Family emergency', from: '15/12/2026', to: '17/12/2026', status: 'pending' },
    { id: '3', reason: 'Vacation extension', from: '01/01/2027', to: '05/01/2027', status: 'rejected' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#e8f5e9', text: '#2e7d32', label: 'Approved' };
      case 'rejected': return { bg: '#ffebee', text: '#c62828', label: 'Rejected' };
      default: return { bg: '#fff8e1', text: '#f57f17', label: 'Pending' };
    }
  };

  return (
    <SafeLayout>
      <ScreenHeader title="My Permissions" showBack onBackPress={() => router.push('/(app)/profile' as any)} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <AppButton 
          title="+ Request Permission" 
          onPress={() => router.push('/(app)/request-permission' as any)}
          style={styles.requestBtn} 
        />

        <Text style={styles.sectionTitle}>History</Text>

        {dummyPermissions.map(perm => {
          const statusStyle = getStatusStyle(perm.status);
          return (
            <AppCard key={perm.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{perm.from} - {perm.to}</Text>
                <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.badgeText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                </View>
              </View>
              <Text style={styles.reasonText}>{perm.reason}</Text>
            </AppCard>
          );
        })}
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  requestBtn: {
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  reasonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  }
});
