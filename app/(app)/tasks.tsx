import React, { useState } from 'react';
import { FlatList, View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TaskCard } from '@/components/cards/TaskCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task.types';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';

export default function TasksScreen() {
  const { tasks, isLoading } = useTasks();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const handlePress = (task: Task) => {
    router.push({ pathname: '/(app)/task-detail' as any, params: { id: task.id } });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  const filters = ['All', 'Accepted Position 1', 'Accepted Position 2'];

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Tasks" showSearch showBell />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterBtn,
                activeFilter === filter ? styles.filterBtnActive : styles.filterBtnInactive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter ? styles.filterTextActive : styles.filterTextInactive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} onPress={handlePress} />}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-circle-outline"
            title="No tasks assigned"
            message="Your supervisor hasn't assigned any tasks yet."
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: SPACING.md }}
      />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: SPACING.md,
  },
  filterBar: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 2,
  },
  filterBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  filterBtnInactive: {
    backgroundColor: 'transparent',
    borderColor: COLORS.secondary,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  filterTextInactive: {
    color: COLORS.secondary,
  },
});
