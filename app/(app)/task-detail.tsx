import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTaskStore } from '@/store/taskStore';
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from '@/constants/taskStatus';
import { formatDate } from '@/utils/formatters';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { TaskStatus } from '@/types/task.types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedTask = useTaskStore((s) => s.selectedTask);
  const isLoading = useTaskStore((s) => s.isLoading);
  const fetchTaskById = useTaskStore((s) => s.fetchTaskById);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

  useEffect(() => {
    if (id) fetchTaskById(id);
  }, [id]);

  if (isLoading || !selectedTask) return <LoadingSpinner fullScreen />;

  const canMarkDone = selectedTask.status !== 'COMPLETED';

  return (
    <SafeLayout>
      <ScreenHeader title="Task Detail" showBack />
      <View style={styles.content}>
        <Text style={styles.title}>{selectedTask.title}</Text>
        <AppBadge
          label={TASK_STATUS_LABELS[selectedTask.status]}
          color={TASK_STATUS_COLORS[selectedTask.status]}
        />
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>{selectedTask.description}</Text>
        <Text style={styles.label}>Due Date</Text>
        <Text style={styles.value}>{formatDate(selectedTask.dueDate)}</Text>
        <Text style={styles.label}>Assigned On</Text>
        <Text style={styles.value}>{formatDate(selectedTask.assignedAt)}</Text>

        {canMarkDone && (
          <AppButton
            title="Mark as Completed"
            onPress={() => updateTaskStatus(selectedTask.id, 'COMPLETED' as TaskStatus)}
            style={{ marginTop: SPACING.lg }}
          />
        )}
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, gap: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  label: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: SPACING.sm },
  description: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 22 },
  value: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md },
});
