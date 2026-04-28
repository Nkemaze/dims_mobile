import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '@/types/attendance.types';
import { formatDate, formatTime } from '@/utils/formatters';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';

const STATUS_COLORS: Record<string, string> = {
  PRESENT: COLORS.success,
  ABSENT: COLORS.error,
  LATE: COLORS.warning,
  EXCUSED: COLORS.info,
};

interface AttendanceCardProps {
  record: AttendanceRecord;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ record }) => {
  const color = STATUS_COLORS[record.status] ?? COLORS.textMuted;

  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(record.date)}</Text>
        <View style={styles.row}>
          {record.checkIn && (
            <View style={styles.timeItem}>
              <Ionicons name="log-in-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.time}>{formatTime(record.checkIn)}</Text>
            </View>
          )}
          {record.checkOut && (
            <View style={styles.timeItem}>
              <Ionicons name="log-out-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.time}>{formatTime(record.checkOut)}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.status, { color }]}>{record.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: RADIUS.full,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  date: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  status: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
