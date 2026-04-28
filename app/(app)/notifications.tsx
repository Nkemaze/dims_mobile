import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { notificationService } from '@/services/notificationService';
import { Notification } from '@/types/notification.types';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationService.getAll().then(setNotifications).finally(() => setIsLoading(false));
  }, []);

  const handlePress = async (notification: Notification) => {
    if (!notification.isRead) {
      await notificationService.markRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Notifications" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard notification={item} onPress={handlePress} />}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="All caught up!"
            message="You have no notifications at this time."
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      />
    </SafeLayout>
  );
}
