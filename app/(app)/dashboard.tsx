import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  console.log(user);
  console.log(user?.fullname);

  return (
    <SafeLayout>
      <ScreenHeader
        title="Dashboard"
        showProfile
        showBell
        onProfilePress={() => router.push('/(app)/profile')}
        onBellPress={() => router.push('/(app)/notifications')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome   back,</Text>
          <Text style={styles.userName}>{user?.fullname}</Text>
          <Text style={styles.roleText}>Software Engineering Intern</Text>
        </View>

        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Days Present</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </AppCard>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Task</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/tasks')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <AppCard style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>Implement Authentication</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>In Progress</Text>
            </View>
          </View>
          <Text style={styles.taskDesc} numberOfLines={2}>
            Build the login and forgot password screens using React Native and Expo Router.
          </Text>
          <View style={styles.taskFooter}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.dueDateText}>Due in 2 days</Text>
          </View>
        </AppCard>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/timetable')}>
            <Text style={styles.seeAllText}>Full Schedule</Text>
          </TouchableOpacity>
        </View>

        <AppCard style={styles.scheduleCard}>
          <View style={styles.timelineLine} />
          
          <View style={styles.scheduleItem}>
            <View style={styles.timelineDot} />
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>09:00 AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleTitle}>Daily Standup</Text>
              <Text style={styles.scheduleSubtitle}>Google Meet</Text>
            </View>
          </View>

          <View style={[styles.scheduleItem, { marginTop: SPACING.md }]}>
            <View style={[styles.timelineDot, styles.timelineDotInactive]} />
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>11:30 AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleTitle}>Code Review</Text>
              <Text style={styles.scheduleSubtitle}>Engineering Team</Text>
            </View>
          </View>
        </AppCard>

      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  welcomeSection: {
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  roleText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  taskCard: {
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  taskTitle: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    backgroundColor: '#ffe0b2',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    color: '#e65100',
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  taskDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  scheduleCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  timelineLine: {
    position: 'absolute',
    left: SPACING.md + 6,
    top: SPACING.xl,
    bottom: SPACING.lg,
    width: 2,
    backgroundColor: COLORS.border,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: '#ffb84d',
    marginRight: SPACING.md,
    marginTop: 2,
    zIndex: 1,
  },
  timelineDotInactive: {
    backgroundColor: COLORS.border,
    borderColor: '#f5f5f5',
  },
  scheduleTime: {
    width: 70,
  },
  timeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
});
