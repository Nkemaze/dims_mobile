import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { useTaskStore } from '@/store/taskStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { quizService } from '@/services/quizService';
import { useAuthStore } from '@/store/authStore';
import { Question, QuizSubmission } from '@/types/quiz.types';
import { TaskStatus } from '@/types/task.types';

export default function QuizTakingScreen() {
  const { id: quizId, taskId } = useLocalSearchParams<{ id: string; taskId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const safeTaskId = Array.isArray(taskId) ? taskId?.[0] : taskId;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) return;
      setIsLoading(true);
      const safeQuizId = Array.isArray(quizId) ? quizId[0] : quizId;
      const data = await quizService.getQuestionsByQuizId(safeQuizId);
      setQuestions(data);
      setIsLoading(false);
    };

    fetchQuestions();
  }, [quizId]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'warning' | 'success' | 'error';
    showCancel?: boolean;
    onConfirm?: () => void;
  }>({ visible: false, title: '', message: '', type: 'warning' });

  const showAlert = (title: string, message: string, type: 'warning' | 'success' | 'error', onConfirm?: () => void, showCancel = false) => {
    setAlertConfig({ visible: true, title, message, type, showCancel, onConfirm });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const submitQuiz = async () => {
    showAlert(
      "Confirm Submission",
      "Are you sure you want to submit your answers?",
      "warning",
      async () => {
        closeAlert();
        if (!user?.id || !quizId) return;
        const safeQuizId = Array.isArray(quizId) ? quizId[0] : quizId;
        setIsSubmitting(true);
        
        const payload: QuizSubmission[] = questions.map(q => ({
          user_id: user.id,
          quiz_id: safeQuizId,
          question_id: q.id,
          answer: responses[q.id] || '',
        }));

        try {
          await quizService.submitQuizAnswers(payload);
          // Removed manual task status update because intern status dynamically references answers
          const { markTaskCompletedLocally, selectedTask } = useTaskStore.getState();
          if (selectedTask?.id) markTaskCompletedLocally(selectedTask.id);
          
          setIsSubmitting(false);
          setTimeout(() => {
            showAlert(
              "Submission Successful",
              "Your quiz has been submitted successfully!",
              "success",
              () => { closeAlert(); router.replace('/(app)/tasks' as any); }
            );
          }, 300);
        } catch (error) {
          setIsSubmitting(false);
          setTimeout(() => {
            showAlert(
              "Submission Error",
              "Failed to submit quiz. Please make sure you are submitting for the first time.",
              "error",
              () => closeAlert()
            );
          }, 300);
        }
      },
      true
    );
  };

  const renderQuestion = (q: Question, index: number) => {
    const isMCQ = q.type === "mcq";
    
    return (
      <View key={q.id} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumberText}>Question {index + 1}</Text>
          <Text style={styles.questionDescText}>{q.question || ''}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {isMCQ ? (
            ['A', 'B', 'C', 'D'].map((letter, optIndex) => {
              // Map options matching HTML logic
              let optionText = '';
              if (letter === 'A') optionText = q.answer || '';
              if (letter === 'B') optionText = q.option1 || '';
              if (letter === 'C') optionText = q.option2 || '';
              if (letter === 'D') optionText = q.option3 || '';
              
              const isSelected = responses[q.id] === letter;

              return (
                <TouchableOpacity 
                  key={letter}
                  style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                  onPress={() => handleResponseChange(q.id, letter)}
                >
                  <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {letter}. {optionText}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <TextInput 
              style={styles.textInput}
              placeholder="Response..."
              placeholderTextColor={COLORS.textMuted}
              value={responses[q.id] || ''}
              onChangeText={(text) => handleResponseChange(q.id, text)}
              multiline
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Quiz: Section 1" showBack onBackPress={() => router.push(`/(app)/quizzes?id=${safeTaskId}` as any)} />
      
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : questions.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>No questions found for this quiz.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subHeaderText}>Choose the letter that corresponds to the correct answer</Text>
          
          {questions.map((q, idx) => renderQuestion(q, idx))}

          <View style={styles.submitContainer}>
            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
              onPress={submitQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitBtnText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Custom Sweet Alert Modal */}
      <Modal transparent visible={alertConfig.visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Icon Placeholder based on Type */}
            <View style={[styles.modalIconContainer, 
              alertConfig.type === 'success' ? { borderColor: '#a5dc86' } :
              alertConfig.type === 'error' ? { borderColor: '#f27474' } :
              { borderColor: '#f8bb86' }
            ]}>
              <Text style={[styles.modalIconText, 
                alertConfig.type === 'success' ? { color: '#a5dc86' } :
                alertConfig.type === 'error' ? { color: '#f27474' } :
                { color: '#f8bb86' }
              ]}>
                {alertConfig.type === 'success' ? '✓' : alertConfig.type === 'error' ? '✕' : '!'}
              </Text>
            </View>

            <Text style={styles.modalTitle}>{alertConfig.title}</Text>
            <Text style={styles.modalMessage}>{alertConfig.message}</Text>
            
            <View style={styles.modalActions}>
              {alertConfig.showCancel && (
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#6c757d' }]} onPress={closeAlert}>
                  <Text style={styles.modalBtnText}>No</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#80002a' }]} onPress={() => { alertConfig.onConfirm ? alertConfig.onConfirm() : closeAlert() }}>
                <Text style={styles.modalBtnText}>{alertConfig.showCancel ? 'Yes' : 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100, // padding for navbar avoidance
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
  subHeaderText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
    color: '#000',
  },
  questionCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  questionHeader: {
    marginBottom: SPACING.md,
  },
  questionNumberText: {
    color: '#80002a',
    fontWeight: 'bold',
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.xs,
  },
  questionDescText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  optionsContainer: {
    marginTop: SPACING.sm,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#951840',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  optionBtnSelected: {
    backgroundColor: '#701030', // darker representation when selected
    borderWidth: 1,
    borderColor: '#fff',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  optionText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: FONTS.sizes.sm,
    backgroundColor: '#fff',
  },
  submitContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  submitBtn: {
    backgroundColor: '#951840',
    paddingHorizontal: SPACING.xl * 1.5,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    minWidth: 150,
    alignItems: 'center',
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONTS.sizes.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalIconText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: SPACING.md,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  modalBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
  },
});
