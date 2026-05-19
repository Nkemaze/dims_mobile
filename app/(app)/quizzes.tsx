import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { quizService } from '@/services/quizService';
import { Quiz } from '@/types/quiz.types';

export default function QuizzesScreen() {
  const { id: taskId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!taskId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // Ensure taskId is just a string
        const safeTaskId = Array.isArray(taskId) ? taskId[0] : taskId;
        const data = await quizService.getQuizzesByTaskId(safeTaskId);
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [taskId]);

  const handleStartQuiz = (quizId: string) => {
    router.push(`/(app)/quiz?id=${quizId}` as any);
  };

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity 
      style={styles.quizCard} 
      onPress={() => handleStartQuiz(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {/* Placeholder for red-white file icon */}
        <Ionicons name="document-text" size={32} color={COLORS.white} />
      </View>
      
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle} numberOfLines={1}>{item.title || 'Quiz'}</Text>
        <Text style={styles.quizDescription} numberOfLines={2}>{item.description || ''}</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.startBtn} onPress={() => handleStartQuiz(item.id)}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Quiz" showBack />
      
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id}
            renderItem={renderQuizItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="information-circle-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>No quizzes found for this task.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
  },
  quizCard: {
    backgroundColor: '#951840', // User's primary color
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    paddingRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizInfo: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  quizTitle: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  quizDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONTS.sizes.xs,
  },
  actionContainer: {
    paddingLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  startBtnText: {
    color: '#80002a',
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.sm,
  },
});
