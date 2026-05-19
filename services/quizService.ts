import api from './api';
import { QUIZ_ENDPOINTS } from '@/constants/api';
import { Quiz, QuizAnswer, Question, QuizSubmission } from '@/types/quiz.types';

export const quizService = {
  getQuizzesByTaskId: async (taskId: string): Promise<Quiz[]> => {
    try {
      const { data } = await api.get<Quiz[]>(QUIZ_ENDPOINTS.GET_BY_TASK, {
        params: { task_id: taskId },
      });
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('Failed to load quizzes URL:', error.config?.url);
      console.error('Failed params:', error.config?.params);
      return [];
    }
  },

  getFirstQuizByTaskId: async (taskId: string): Promise<Quiz | null> => {
    try {
      const { data } = await api.get<Quiz[] | Quiz>(QUIZ_ENDPOINTS.GET_BY_TASK, {
        params: { task_id: taskId },
      });
      const quiz = Array.isArray(data) ? data[0] : data;
      return quiz || null;
    } catch (error) {
      console.error('Failed to load quiz details:', error);
      return null;
    }
  },

  getQuizAnswers: async (quizId: string): Promise<QuizAnswer[]> => {
    try {
      const { data } = await api.get<QuizAnswer[]>(QUIZ_ENDPOINTS.GET_ANSWERS, {
        params: { quiz_id: quizId },
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to load quiz answers:', error);
      return [];
    }
  },

  getQuestionsByQuizId: async (quizId: string): Promise<Question[]> => {
    try {
      const { data } = await api.get<Question[]>(QUIZ_ENDPOINTS.GET_QUESTIONS, {
        params: { quiz_id: quizId },
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to load questions:', error);
      return [];
    }
  },

  getAllQuizzes: async (): Promise<Quiz[]> => {
    try {
      const { data } = await api.get<Quiz[]>(QUIZ_ENDPOINTS.GET_BY_TASK);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  getQuizAnswersByUser: async (userId: string): Promise<QuizAnswer[]> => {
    try {
      const { data } = await api.get<QuizAnswer[]>(QUIZ_ENDPOINTS.GET_ANSWERS, {
        params: { user_id: userId },
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  submitQuizAnswers: async (payload: QuizSubmission[]): Promise<void> => {
    // If it fails, we deliberately let the error bubble up so the UI can catch it and display the warning alert correctly
    await api.post(QUIZ_ENDPOINTS.SUBMIT_ANSWERS_MANY, payload);
  },
};
