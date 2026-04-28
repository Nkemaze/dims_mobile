import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { AppCard } from '@/components/common/AppCard';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { getInitials } from '@/utils/formatters';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  return (
    <SafeLayout>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.name}>{user?.firstName ?? 'Intern'}</Text>
        </View>
        <Avatar
          initials={getInitials(user?.firstName ?? 'I', user?.lastName ?? 'N')}
          size={48}
        />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <AppCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </AppCard>
      </View>

      {/* Recent Tasks */}
      <Text style={styles.sectionTitle}>Recent Tasks</Text>
      {tasks.slice(0, 3).map((task) => (
        <AppCard key={task.id} style={styles.taskRow}>
          <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
          <Text style={styles.taskStatus}>{task.status}</Text>
        </AppCard>
      ))}
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  name: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  taskTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, flex: 1 },
  taskStatus: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
});
