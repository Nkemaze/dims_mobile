import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useTimetableStore } from '@/store/timetableStore';
import { format } from 'date-fns';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, intern } = useAuthStore();
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
  const { records, fetchAttendance, isLoading: attendanceLoading } = useAttendanceStore();
  const { entries, fetchTimetable } = useTimetableStore();

  useEffect(() => {
    if (intern?.id) {
      fetchAttendance(intern.id);
      if (intern.internshipposition_id) {
        fetchTasks(intern.internshipposition_id);
      }
    }
    fetchTimetable();
  }, [intern?.id, intern?.internshipposition_id, fetchAttendance, fetchTasks, fetchTimetable]);

  const daysPresent = records.filter(r => r.status === 'PRESENT').length;
  const tasksDone = tasks.filter(t => t.status === 'COMPLETED').length;
  const currentTask = tasks.find(t => t.status === 'IN_PROGRESS') || tasks[0];

  const today = format(new Date(), 'EEEE').toUpperCase();
  const todaysSchedule = entries.filter(e => e.dayOfWeek === today);
  // console.log(user?.id)
  // console.log(intern)

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
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{intern?.fullname || 'Intern'}</Text>
          <Text style={styles.roleText}>{intern?.department || 'Software Engineering Intern'}</Text>
        </View>

        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            {attendanceLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                <Text style={styles.statValue}>{daysPresent}</Text>
                <Text style={styles.statLabel}>Days Present</Text>
              </>
            )}
          </AppCard>
          <AppCard style={styles.statCard}>
            {tasksLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.primary} />
                <Text style={styles.statValue}>{tasksDone}</Text>
                <Text style={styles.statLabel}>Tasks Done</Text>
              </>
            )}
          </AppCard>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Task</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/tasks')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {currentTask ? (
          <AppCard style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{currentTask.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentTask.status) + '22' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(currentTask.status) }]}>
                  {currentTask.status.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.taskDesc} numberOfLines={2}>
              {currentTask.description}
            </Text>
            <View style={styles.taskFooter}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.dueDateText}>
                Due: {currentTask.dueDate ? format(new Date(currentTask.dueDate), 'MMM dd, yyyy') : 'No date'}
              </Text>
            </View>
          </AppCard>
        ) : (
          <AppCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No tasks assigned yet.</Text>
          </AppCard>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
          <TouchableOpacity onPress={() => router.push('/(app)/timetable')}>
            <Text style={styles.seeAllText}>Full Schedule</Text>
          </TouchableOpacity>
        </View>

        <AppCard style={styles.scheduleCard}>
          <View style={styles.timelineLine} />
          
          {todaysSchedule.length > 0 ? (
            todaysSchedule.map((item, index) => (
              <View key={item.id} style={[styles.scheduleItem, index > 0 && { marginTop: SPACING.md }]}>
                <View style={[styles.timelineDot, index > 0 && styles.timelineDotInactive]} />
                <View style={styles.scheduleTime}>
                  <Text style={styles.timeText}>{item.startTime}</Text>
                </View>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.scheduleTitle}>{item.title}</Text>
                  <Text style={styles.scheduleSubtitle}>{item.location || item.description || 'No details'}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptySchedule}>
              <Text style={styles.emptyText}>No events scheduled for today.</Text>
            </View>
          )}
        </AppCard>

      </ScrollView>
    </SafeLayout>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return '#2d865c';
    case 'IN_PROGRESS': return '#e65100';
    case 'OVERDUE': return '#dc3545';
    default: return '#6c757d';
  }
};

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
    justifyContent: 'center',
    minHeight: 100,
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
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
  emptyCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
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
    width: 80,
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
  emptySchedule: {
    padding: SPACING.md,
    alignItems: 'center',
  },
});
