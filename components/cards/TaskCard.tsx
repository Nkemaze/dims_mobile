import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types/task.types';
import { AppBadge } from '@/components/common/AppBadge';
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from '@/constants/taskStatus';
import { formatDate } from '@/utils/formatters';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(task)} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        <AppBadge
          label={TASK_STATUS_LABELS[task.status]}
          color={TASK_STATUS_COLORS[task.status]}
        />
      </View>
      <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
      <View style={styles.footer}>
        <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.dueDate}>Due: {formatDate(task.dueDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dueDate: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
});
