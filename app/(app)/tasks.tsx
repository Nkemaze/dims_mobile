import React from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TaskCard } from '@/components/cards/TaskCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task.types';

export default function TasksScreen() {
  const { tasks, isLoading } = useTasks();
  const router = useRouter();

  const handlePress = (task: Task) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push({ pathname: '/(app)/task-detail' as any, params: { id: task.id } });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="My Tasks" />
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
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      />
    </SafeLayout>
  );
}
