import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTimetable } from '@/hooks/useTimetable';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

export default function TimetableScreen() {
  const { entries, isLoading } = useTimetable();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (isLoading) return <LoadingSpinner fullScreen />;

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  const filteredEntries = entries.filter(e => {
    const dayName = format(selectedDate, 'EEEE').toUpperCase();
    return e.dayOfWeek === dayName;
  });

  return (
    <SafeLayout>
      <ScreenHeader title="Timetable" showBack />

      <View style={styles.weekNavigator}>
        <TouchableOpacity onPress={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{format(selectedDate, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateBox, isSelected && styles.activeDateBox]}
              onPress={() => setSelectedDate(day)}
            >
              <Text style={[styles.dayName, isSelected && styles.activeDateText]}>
                {format(day, 'eee')}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.activeDateText]}>
                {format(day, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <View key={entry.id} style={styles.activityItem}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{entry.startTime}</Text>
                <Text style={styles.timeSeparator}>-</Text>
                <Text style={styles.timeText}>{entry.endTime}</Text>
              </View>
              <View style={styles.activityCard}>
                <Text style={styles.activityTitle}>{entry.title}</Text>
                <Text style={styles.supervisorName}>Supervisor Name</Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="time-outline"
            title="No activities"
            message="No activities scheduled for this day."
          />
        )}
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  weekNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dateBox: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: '13%',
  },
  activeDateBox: {
    backgroundColor: '#007a40',
  },
  dayName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activeDateText: {
    color: COLORS.white,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timeColumn: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  activityCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.success,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  supervisorName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  }
});
