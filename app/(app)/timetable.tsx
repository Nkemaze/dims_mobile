import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTimetable } from '@/hooks/useTimetable';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function TimetableScreen() {
  const { entries, isLoading } = useTimetable();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (entries.length === 0) {
    return (
      <SafeLayout>
        <ScreenHeader title="Timetable" />
        <EmptyState icon="time-outline" title="No schedule" message="Your timetable hasn't been set up yet." />
      </SafeLayout>
    );
  }

  const grouped = DAY_ORDER.reduce<Record<string, typeof entries>>((acc, day) => {
    acc[day] = entries.filter((e) => e.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <SafeLayout>
      <ScreenHeader title="Timetable" />
      {DAY_ORDER.map((day) =>
        grouped[day].length > 0 ? (
          <View key={day} style={styles.dayBlock}>
            <Text style={styles.dayLabel}>{day}</Text>
            {grouped[day].map((entry) => (
              <AppCard key={entry.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryTime}>{entry.startTime} – {entry.endTime}</Text>
                {entry.location && <Text style={styles.entryLocation}>{entry.location}</Text>}
              </AppCard>
            ))}
          </View>
        ) : null
      )}
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  dayBlock: { marginBottom: SPACING.md },
  dayLabel: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  entry: { marginBottom: SPACING.sm, gap: 4 },
  entryTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  entryTime: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  entryLocation: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
});
