import React, { useState } from 'react';
import { FlatList, View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TaskCard } from '@/components/cards/TaskCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/task.types';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const { tasks, isLoading, hasNoApprovedPositions, approvedPositions } = useTasks();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePress = (task: Task) => {
    router.push({ pathname: '/(app)/task-detail' as any, params: { id: task.id } });
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (hasNoApprovedPositions) {
    return (
      <SafeLayout scrollable={false}>
        <ScreenHeader title="Tasks" 
          showSearch={false} 
          showBell 
          onBellPress={() => router.push('/(app)/notifications')} 
        />
        <EmptyState
          icon="alert-circle-outline"
          title="Action Required"
          message="You do not have any approved internship positions. Please contact your supervisor to get your application approved."
        />
      </SafeLayout>
    );
  }

  const filters = [
    'All',
    ...(approvedPositions
      ?.filter((p) => p.name !== 'Unknown Position')
      .map((p) => p.name) || []),
  ];

  // Apply active filter and optionally search query
  const displayedTasks = tasks.filter(task => {
    // position filter
    let matchesPosition = true;
    if (activeFilter !== 'All') {
      const targetPos = approvedPositions?.find(p => p.name === activeFilter);
      if (targetPos) {
        matchesPosition = task.internshipposition_id === targetPos.id;
      }
    }
    // search filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return matchesPosition && matchesSearch;
  });

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Tasks" 
        showSearch 
        showBell 
        onBellPress={() => router.push('/(app)/notifications')} 
        onSearchPress={() => setShowSearch(!showSearch)} 
      />

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search task..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {filters.length > 1 && (
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
      )}

      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
           const { completedTaskIds } = useTaskStore.getState();
           return <TaskCard task={item} isCompleted={completedTaskIds.includes(item.id)} onPress={handlePress} />;
        }}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-circle-outline"
            title="No tasks assigned"
            message="No tasks match the selected filter."
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: SPACING.xs,
    fontSize: FONTS.sizes.sm,
  }
});
