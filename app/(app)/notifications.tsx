import React, { useEffect, useState } from 'react';
import { SectionList, Text, StyleSheet } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { notificationService } from '@/services/notificationService';
import { Notification } from '@/types/notification.types';
import { COLORS, SPACING } from '@/constants/theme';
import { isToday, isYesterday } from 'date-fns';

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

  const sections = [
    {
      title: 'Today',
      data: notifications.filter(n => isToday(new Date(n.createdAt))),
    },
    {
      title: 'Yesterday',
      data: notifications.filter(n => isYesterday(new Date(n.createdAt))),
    },
    {
      title: 'Earlier',
      data: notifications.filter(n => !isToday(new Date(n.createdAt)) && !isYesterday(new Date(n.createdAt))),
    },
  ].filter(section => section.data.length > 0);

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader title="Notification" />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard notification={item} onPress={handlePress} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="All caught up!"
            message="You have no notifications at this time."
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: SPACING.md }}
      />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
});
