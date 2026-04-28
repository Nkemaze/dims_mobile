import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Notification } from '@/types/notification.types';
import { formatRelativeDate } from '@/utils/formatters';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, !notification.isRead && styles.unread]}
      onPress={() => onPress(notification)}
      activeOpacity={0.8}
    >
      {!notification.isRead && <View style={styles.dot} />}
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.time}>{formatRelativeDate(notification.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  unread: {
    borderColor: COLORS.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
});
