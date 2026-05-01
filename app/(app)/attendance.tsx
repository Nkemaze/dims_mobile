import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAttendance } from '@/hooks/useAttendance';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

export default function AttendanceScreen() {
  const { records, isLoading } = useAttendance();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (isLoading) return <LoadingSpinner fullScreen />;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusColor = (date: Date) => {
    const record = records.find(r => isSameDay(new Date(r.date), date));
    if (!record) return '#f8f9fa';
    if (record.status === 'PRESENT') return COLORS.success;
    if (record.status === 'ABSENT') return COLORS.primary;
    return COLORS.warning;
  };

  const stats = records.reduce((acc, curr) => {
    if (curr.status === 'PRESENT') acc.present++;
    else if (curr.status === 'ABSENT') acc.absent++;
    else acc.other++;
    return acc;
  }, { present: 0, absent: 0, other: 0 });

  return (
    <SafeLayout>
      <ScreenHeader title="My Attendance" />

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <AppCard style={[styles.statCard, { borderBottomColor: COLORS.success, borderBottomWidth: 4 }]}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.present}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </AppCard>
          <AppCard style={[styles.statCard, { borderBottomColor: COLORS.primary, borderBottomWidth: 4 }]}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{stats.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </AppCard>
          <AppCard style={[styles.statCard, { borderBottomColor: COLORS.warning, borderBottomWidth: 4 }]}>
            <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.other}</Text>
            <Text style={styles.statLabel}>Other</Text>
          </AppCard>
        </View>

        <View style={styles.monthNavigator}>
          <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>
          <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendar}>
           <View style={styles.grid}>
             {days.map((day, index) => (
               <View
                 key={index}
                 style={[
                   styles.dayBox,
                   { backgroundColor: getStatusColor(day) },
                   isSameDay(day, new Date()) && styles.today
                 ]}
               >
                 <Text style={[
                   styles.dayText,
                   getStatusColor(day) !== '#f8f9fa' ? { color: COLORS.white } : { color: COLORS.textPrimary }
                 ]}>
                   {format(day, 'd')}
                 </Text>
               </View>
             ))}
           </View>
        </View>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  calendar: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    minHeight: 300,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBox: {
    width: '12%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  today: {
    borderWidth: 2,
    borderColor: COLORS.black,
  }
});
