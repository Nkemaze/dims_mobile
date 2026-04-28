import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types/task.types';
import { COLORS, RADIUS, SPACING, FONTS } from '@/constants/theme';
import { AppCard } from '../common/AppCard';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const statusColor = task.status === 'COMPLETED' ? COLORS.success : COLORS.warning;
  const statusLabel = task.status === 'COMPLETED' ? 'Submitted' : 'Pending';

  return (
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.8}>
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.logoContainer}>
             <Ionicons name="business" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
            <View style={styles.statusRow}>
               <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{statusLabel}</Text>
               </View>
            </View>
          </View>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
