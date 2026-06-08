import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { quizService } from '@/services/quizService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/task.types';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskProgress {
  task: Task;
  answered: number;
  total: number;
  percent: number;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tasks, hasNoApprovedPositions, isLoading: tasksLoading, fetchTasksWithPositions } = useTaskStore();

  const [taskProgressList, setTaskProgressList] = useState<TaskProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);

  // Fetch tasks on every screen focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchTasksWithPositions(user.id);
      }
    }, [user?.id, fetchTasksWithPositions])
  );

  // Once tasks load, fetch per-task quiz progress
  useEffect(() => {
    if (!tasks.length || !user?.id) {
      setTaskProgressList([]);
      return;
    }
    loadAllProgress(tasks, user.id);
  }, [tasks, user?.id]);

  async function loadAllProgress(taskList: Task[], userId: string) {
    setProgressLoading(true);
    try {
      const results = await Promise.all(
        taskList.map(async (task): Promise<TaskProgress | null> => {
          // Get the quiz for this task
          const quiz = await quizService.getFirstQuizByTaskId(task.id);
          if (!quiz) return null;

          // Get questions and user's answers in parallel
          const [questions, answers] = await Promise.all([
            quizService.getQuestionsByQuizId(quiz.id),
            quizService.getQuizAnswersByUser(userId),
          ]);

          const total = questions.length;
          // Filter answers that belong to this specific quiz
          const answered = answers.filter(a => a.quiz_id === quiz.id).length;
          const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

          return { task, answered, total, percent };
        })
      );

      // Filter out tasks with no quiz
      setTaskProgressList(results.filter(Boolean) as TaskProgress[]);
    } catch (err) {
      console.error('[ProgressScreen] loadAllProgress error:', err);
    } finally {
      setProgressLoading(false);
    }
  }

  const completedCount = taskProgressList.filter(t => t.percent === 100).length;
  const notCompletedCount = taskProgressList.length - completedCount;

  const isLoading = tasksLoading || progressLoading;

  // ── No position assigned ──
  if (!tasksLoading && hasNoApprovedPositions) {
    return (
      <SafeLayout>
        <ScreenHeader title="Progress" showBack onBackPress={() => router.push('/(app)/profile' as any)} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Internship Yet</Text>
          <Text style={styles.emptySubtitle}>You have not been assigned an internship position.</Text>
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader
        title="Progress"
        showBack
        onBackPress={() => router.push('/(app)/profile' as any)}
      />

      {isLoading && taskProgressList.length === 0 ? (
        <LoadingSpinner fullScreen />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Summary Cards ── */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: COLORS.success }]}>
              <Text style={styles.summaryValue}>
                {progressLoading ? '–' : completedCount}
              </Text>
              <Text style={styles.summaryLabel}>Tasks Completed</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.summaryValue}>
                {progressLoading ? '–' : notCompletedCount}
              </Text>
              <Text style={styles.summaryLabel}>Tasks not Completed</Text>
            </View>
          </View>

          {/* ── Task List ── */}
          <Text style={styles.sectionTitle}>Projects &amp; Tasks</Text>

          {progressLoading && taskProgressList.length === 0 ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
          ) : taskProgressList.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No tasks with quizzes found.</Text>
            </View>
          ) : (
            taskProgressList.map(({ task, answered, total, percent }) => (
              <TaskProgressCard
                key={task.id}
                title={task.title}
                answered={answered}
                total={total}
                percent={percent}
              />
            ))
          )}

          <View style={{ height: SPACING.xl }} />
        </ScrollView>
      )}
    </SafeLayout>
  );
}

// ─── Task Progress Card ───────────────────────────────────────────────────────

interface TaskProgressCardProps {
  title: string;
  answered: number;
  total: number;
  percent: number;
}

function TaskProgressCard({ title, answered, total, percent }: TaskProgressCardProps) {
  const barColor = percent === 100 ? COLORS.success : COLORS.primary;

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          <Text style={{ fontWeight: '800', color: barColor }}>{percent}% </Text>
          {title}
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percent}%` as any, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={styles.counter}>{answered}/{total}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.md,
  },

  // ── Summary ──
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 56,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },

  // ── Section title ──
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },

  // ── Task card ──
  taskCard: {
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
  taskHeader: {
    marginBottom: SPACING.sm,
  },
  taskTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  counter: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'right',
  },

  // ── Empty states ──
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
});
