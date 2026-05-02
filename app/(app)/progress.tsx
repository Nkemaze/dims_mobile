import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function ProgressScreen() {
  const router = useRouter();
  const dummyTasks = [
    { id: '1', title: 'Implement Login Form', answered: 5, total: 5 },
    { id: '2', title: 'Database Schema Design', answered: 3, total: 5 },
    { id: '3', title: 'API Endpoints Structure', answered: 0, total: 4 },
  ];

  const completedTasks = dummyTasks.filter(t => t.answered === t.total).length;
  const notCompletedTasks = dummyTasks.length - completedTasks;

  return (
    <SafeLayout>
      <ScreenHeader title="Progress" showBack onBackPress={() => router.push('/(app)/profile' as any)} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryContainer}>
          <AppCard style={styles.summaryCard}>
            <View style={[styles.dot, { backgroundColor: '#2e7d32' }]} />
            <Text style={styles.summaryValue}>{completedTasks}</Text>
            <Text style={styles.summaryLabel}>Completed Tasks</Text>
          </AppCard>
          
          <AppCard style={styles.summaryCard}>
            <View style={[styles.dot, { backgroundColor: '#d32f2f' }]} />
            <Text style={styles.summaryValue}>{notCompletedTasks}</Text>
            <Text style={styles.summaryLabel}>Not Completed</Text>
          </AppCard>
        </View>

        <Text style={styles.sectionTitle}>Task Completion</Text>

        {dummyTasks.map(task => {
          const progressPercent = Math.round((task.answered / task.total) * 100);
          return (
            <AppCard key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{progressPercent}% {task.title}</Text>
                <Text style={styles.taskCounter}>{task.answered}/{task.total}</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? '#2e7d32' : COLORS.primary }]} />
              </View>
            </AppCard>
          );
        })}
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  taskCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  taskTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  taskCounter: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
  },
  progressContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: RADIUS.full,
  }
});
