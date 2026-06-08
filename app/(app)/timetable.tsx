import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTimetable } from '@/hooks/useTimetable';
import { COLORS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useRouter } from 'expo-router';

export default function TimetableScreen() {
  const router = useRouter();
  const { entries, isLoading, error, fetchTimetable } = useTimetable();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTimetable();
    setRefreshing(false);
  };

  const handlePrevWeek = () => {
    const newWeekStart = addDays(currentWeekStart, -7);
    setCurrentWeekStart(newWeekStart);
    
    const today = new Date();
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(newWeekStart, i));
    const isTodayInWeek = weekDays.some(day => isSameDay(day, today));
    setSelectedDate(isTodayInWeek ? today : newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = addDays(currentWeekStart, 7);
    setCurrentWeekStart(newWeekStart);
    
    const today = new Date();
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(newWeekStart, i));
    const isTodayInWeek = weekDays.some(day => isSameDay(day, today));
    setSelectedDate(isTodayInWeek ? today : newWeekStart);
  };

  if (isLoading && !refreshing) return <LoadingSpinner fullScreen />;

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const filteredEntries = entries.filter(e => e.activityDate === selectedDateStr);

  return (
    <SafeLayout refreshing={refreshing} onRefresh={handleRefresh}>
      <ScreenHeader 
        title="Timetable" 
        showBack 
        onBackPress={() => router.push('/(app)/profile' as any)} 
      />

      {/* Week Navigator */}
      <View style={styles.weekNavigator}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.navArrow}>
          <Ionicons name="arrow-back" size={20} color="#80002a" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {format(currentWeekStart, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navArrow}>
          <Ionicons name="arrow-forward" size={20} color="#80002a" />
        </TouchableOpacity>
      </View>

      {/* Date Selector Container */}
      <View style={styles.dateSelectorContainer}>
        <View style={styles.dateSelector}>
          {weekDays.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateBox, isSelected && styles.activeDateBox]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[styles.dayName, isSelected && styles.activeDayName]}>
                  {format(day, 'eee')}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.activeDayNumber]}>
                  {format(day, 'dd')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Timetable entries */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load timetable.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <View key={entry.id} style={styles.activityBox}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{entry.title}</Text>
                {(entry.internshipPositionTitle || entry.supervisorFullname) ? (
                  <Text style={styles.activitySubtitle}>
                    {entry.internshipPositionTitle || ''}
                    {entry.internshipPositionTitle && entry.supervisorFullname ? ' | ' : ''}
                    {entry.supervisorFullname || ''}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.activityTime}>
                {entry.startTime} - {entry.endTime}
              </Text>
            </View>
          ))
        ) : (
          <EmptyState
            icon="time-outline"
            title="No activities"
            message="No timetable available for this day."
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navArrow: {
    padding: SPACING.xs,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#80002a',
  },
  dateSelectorContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    width: '12.5%',
  },
  activeDateBox: {
    backgroundColor: '#007a40',
  },
  dayName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  activeDayName: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  activeDayNumber: {
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    flex: 1,
  },
  activityBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9f7ef',
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007a40',
    marginBottom: SPACING.md,
  },
  activityInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#007a40',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: '#80002a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
