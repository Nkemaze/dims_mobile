import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { supervisorService } from '@/services/supervisorService';
import { quizService } from '@/services/quizService';
import { Supervisor } from '@/types/supervisor.types';
import { Quiz } from '@/types/quiz.types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const selectedTask = useTaskStore((s) => s.selectedTask);
  const isLoadingTask = useTaskStore((s) => s.isLoading);
  const fetchTaskById = useTaskStore((s) => s.fetchTaskById);

  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isLoadingExtra, setIsLoadingExtra] = useState<boolean>(true);

  useEffect(() => {
    if (id) fetchTaskById(id);
  }, [id]);

  useEffect(() => {
    const fetchExtraDetails = async () => {
      if (!selectedTask || !id) return;
      setIsLoadingExtra(true);

      // We can fetch the quiz and the supervisor at the same time
      const safeId = Array.isArray(id) ? id[0] : id;
      const [fetchedQuiz, supervisorData] = await Promise.all([
        quizService.getFirstQuizByTaskId(safeId),
        selectedTask.assigned_by 
          ? supervisorService.getById(selectedTask.assigned_by) 
          : Promise.resolve(null)
      ]);

      setQuiz(fetchedQuiz);
      setSupervisor(supervisorData);

      // Check quiz answers if quiz exists
      if (fetchedQuiz && user?.id) {
        const answers = await quizService.getQuizAnswers(fetchedQuiz.id);
        const answered = answers.some(a => a.user_id === user.id);
        setHasAnswered(answered);
      }

      setIsLoadingExtra(false);
    };

    fetchExtraDetails();
  }, [selectedTask?.id, id]);

  if (isLoadingTask || !selectedTask) {
    return (
      <SafeLayout>
        <ScreenHeader title="Task Details" showBack />
        <View style={styles.centerBox}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      </SafeLayout>
    );
  }

  // Placeholder for video or static image
  const defaultImage = 'https://via.placeholder.com/800x400.png?text=Task+Media+Placeholder';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Media Section */}
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: (selectedTask as any).media || defaultImage }} 
            style={styles.mediaImage} 
            resizeMode="cover" 
          />
        </View>

        {/* Task Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{selectedTask.title}</Text>
          <Text style={styles.description}>{selectedTask.description}</Text>
          
          <Text style={styles.boldText}>Sections: <Text style={styles.normalText}>3</Text></Text>
          <Text style={[styles.boldText, { marginTop: SPACING.sm }]}>Skills you'll be learning:</Text>
          <View style={{ alignSelf: 'flex-start', marginTop: SPACING.xs }}>
             <View style={styles.skillBadge}>
                <Text style={styles.skillBadgeText}>Web Programming</Text>
             </View>
          </View>

          <Text style={[styles.boldText, { marginTop: SPACING.lg }]}>Status:</Text>
          <View style={{ alignSelf: 'flex-start', marginTop: SPACING.xs }}>
            {!isLoadingExtra ? (
              <View style={[styles.statusBadge, { backgroundColor: hasAnswered ? '#28a745' : '#ffc107' }]}>
                <Text style={styles.statusBadgeText}>{hasAnswered ? 'Submitted' : 'Pending'}</Text>
              </View>
            ) : (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
          </View>

          {/* Supervisor Card */}
          {supervisor && (
            <View style={styles.supervisorCard}>
              <View style={styles.supervisorAvatarContainer}>
                <Image 
                  source={{ uri: supervisor.avatar || supervisor.profile_picture || 'https://via.placeholder.com/50' }}
                  style={styles.supervisorImage}
                />
              </View>
              <View style={styles.supervisorInfo}>
                <Text style={styles.supervisorName}>Engineer {supervisor.fullname || supervisor.name || 'Supervisor'}</Text>
                <Text style={styles.supervisorRole}>{supervisor.role || 'Speaker'}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Proceed Button */}
          <TouchableOpacity 
            style={styles.proceedBtn} 
            onPress={() => {
                 router.push(`/(app)/quizzes?id=${id}`);
            }}
          >
            <Text style={styles.proceedBtnText}>Proceed To Quiz</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl * 1.5,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcon: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  mediaContainer: {
    backgroundColor: '#000',
    width: '100%',
    height: 220,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginTop: -20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.sm, // optional to look slightly inset
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: '#000',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  boldText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: '#000',
  },
  normalText: {
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  skillBadge: {
    backgroundColor: '#80002a',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  skillBadgeText: {
    color: COLORS.white,
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  supervisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe3e1',
    borderRadius: 10,
    padding: SPACING.sm,
    marginTop: SPACING.lg,
  },
  supervisorAvatarContainer: {
    marginRight: SPACING.sm,
  },
  supervisorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  supervisorInfo: {
    flex: 1,
  },
  supervisorName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: '#ff6200',
  },
  supervisorRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: SPACING.xl,
  },
  proceedBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
});
