import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { useAttendance } from '@/hooks/useAttendance';
import { AttendanceRecord, AttendanceStatus } from '@/types/attendance.types';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, subMonths } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Returns YYYY-MM-DD from any ISO date string using UTC to avoid timezone shifts */
function toUtcDateStr(isoStr: string): string {
  return new Date(isoStr).toISOString().split('T')[0];
}

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: COLORS.success,   // green
  Absent:  COLORS.primary,   // maroon
  Other:   COLORS.warning,   // orange/yellow
};

/** Split an array of days (Date objects) into weeks (Sunday–Saturday buckets) */
function groupIntoWeeks(days: Date[]): Date[][] {
  const weeks: Date[][] = [];
  let week: Date[] = [];

  days.forEach((day) => {
    week.push(day);
    if (day.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length > 0) weeks.push(week);
  return weeks;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AttendanceScreen() {
  const router = useRouter();
  const { records, isLoading, fetchAttendance } = useAttendance();

  // Re-fetch every time this screen comes into focus so new attendance
  // records marked elsewhere are always reflected immediately.
  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [fetchAttendance])
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Build a lookup map: "YYYY-MM-DD" → status, from all fetched records
  const dayStatusMap = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    records.forEach((r: AttendanceRecord) => {
      const key = toUtcDateStr(r.attendance_date);
      map[key] = r.status;
    });
    return map;
  }, [records]);

  // All days in the currently displayed month
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const count = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1));
  }, [currentMonth]);

  const weeks = useMemo(() => groupIntoWeeks(daysInMonth), [daysInMonth]);

  // Month-scoped totals
  const totals = useMemo(() => {
    let present = 0, absent = 0, other = 0;
    daysInMonth.forEach((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const status = dayStatusMap[key];
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Other') other++;
    });
    return { present, absent, other };
  }, [daysInMonth, dayStatusMap]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader
        title="My Attendance"
        showBack
        onBackPress={() => router.push('/(app)/profile' as any)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Summary Cards ── */}
        <View style={styles.statsRow}>
          <StatCard value={totals.present} label="Total Present" color={COLORS.success} />
          <StatCard value={totals.absent}  label="Absent"        color={COLORS.primary} />
          <StatCard value={totals.other}   label="Other"         color={COLORS.warning} />
        </View>

        {/* ── Month Navigator ── */}
        <View style={styles.monthNav}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <Ionicons name="chevron-back" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ── Your Presence ── */}
        <Text style={styles.sectionTitle}>Your Presence</Text>

        {weeks.map((week, weekIndex) => (
          <WeekCard
            key={weekIndex}
            weekNumber={weekIndex + 1}
            days={week}
            dayStatusMap={dayStatusMap}
            todayStr={todayStr}
          />
        ))}

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color={COLORS.success} label="Present" />
          <LegendItem color={COLORS.primary} label="Absent"  />
          <LegendItem color={COLORS.warning} label="Other"   />
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface WeekCardProps {
  weekNumber: number;
  days: Date[];
  dayStatusMap: Record<string, AttendanceStatus>;
  todayStr: string;
}

function WeekCard({ weekNumber, days, dayStatusMap, todayStr }: WeekCardProps) {
  return (
    <View style={styles.weekCard}>
      <Text style={styles.weekHeader}>Week {weekNumber}</Text>
      <View style={styles.daysRow}>
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const status  = dayStatusMap[dateStr];
          const isToday = dateStr === todayStr;
          const dayOfWeek = day.getDay();

          const bgColor = status ? STATUS_COLORS[status] : '#e9ecef';
          const textColor = status ? COLORS.white : COLORS.textSecondary;

          return (
            <View
              key={i}
              style={[
                styles.dayChip,
                { backgroundColor: bgColor },
                isToday && styles.dayChipToday,
              ]}
            >
              <Text style={[styles.dayChipLabel, { color: textColor }]}>
                {DAY_LABELS[dayOfWeek]}
              </Text>
              <Text style={[styles.dayChipDate, { color: textColor }]}>
                {day.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.md,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    marginTop: 4,
    textAlign: 'center',
  },

  // ── Month nav ──
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  navBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: 6,
  },
  monthLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // ── Section title ──
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  // ── Week card ──
  weekCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  weekHeader: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },

  // ── Day chip ──
  dayChip: {
    width: 40,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  dayChipToday: {
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  dayChipLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  dayChipDate: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },

  // ── Legend ──
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
});
