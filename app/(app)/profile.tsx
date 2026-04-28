import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { Avatar } from '@/components/common/Avatar';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ─── TODO: Replace with real API data when backend is ready ──────────────────
const STATIC_PROFILE = {
  firstName: 'Chukwuemeka',
  lastName: 'Okonkwo',
  email: 'emeka.okonkwo@digimark.com',
  phone: '+234 810 234 5678',
  department: 'Software Engineering',
  supervisorName: 'Mr. Adebayo Tunde',
  startDate: 'Jan 06, 2025',
  endDate: 'Jul 06, 2025',
  internId: 'DM-INT-0042',
};

export default function ProfileScreen() {
  const router = useRouter();
  const p = STATIC_PROFILE;
  const initials = `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();

  const handleSignOut = () => {
    // TODO: call logout() from useAuth() when auth is wired up
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace('/(auth)/login' as any);
  };

  return (
    <SafeLayout>
      <ScreenHeader title="My Profile" />

      {/* Avatar + Name */}
      <View style={styles.avatarBlock}>
        <Avatar initials={initials} size={84} />
        <Text style={styles.name}>{p.firstName} {p.lastName}</Text>
        <Text style={styles.email}>{p.email}</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{p.internId}</Text>
        </View>
      </View>

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <AppCard style={styles.infoCard}>
        <InfoRow icon="call-outline" label="Phone" value={p.phone} />
        <InfoRow icon="business-outline" label="Department" value={p.department} />
        <InfoRow icon="person-outline" label="Supervisor" value={p.supervisorName} />
      </AppCard>

      {/* Internship Details */}
      <Text style={styles.sectionTitle}>Internship Period</Text>
      <AppCard style={styles.infoCard}>
        <InfoRow icon="calendar-outline" label="Start Date" value={p.startDate} />
        <InfoRow icon="flag-outline" label="End Date" value={p.endDate} />
      </AppCard>

      <AppButton
        title="Sign Out"
        variant="outline"
        onPress={handleSignOut}
        style={{ marginTop: SPACING.lg }}
      />
    </SafeLayout>
  );
}

// ─── Reusable row component ───────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarBlock: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  idBadge: {
    backgroundColor: `${COLORS.primary}22`,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: SPACING.xs,
  },
  idText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  infoCard: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
  },
});
