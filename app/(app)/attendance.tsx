import React from 'react';
import { FlatList } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AttendanceCard } from '@/components/cards/AttendanceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAttendance } from '@/hooks/useAttendance';

export default function AttendanceScreen() {
  const { records, isLoading } = useAttendance();

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Attendance" />
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AttendanceCard record={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No records yet"
            message="Your attendance records will appear here."
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      />
    </SafeLayout>
  );
}
