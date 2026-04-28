import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Notification } from '@/types/notification.types';
import { formatRelativeDate } from '@/utils/formatters';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '../common/AppCard';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      activeOpacity={0.8}
    >
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.logoContainer}>
             <Ionicons name="business" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
            <Text style={styles.time}>{formatRelativeDate(notification.createdAt)}</Text>
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
    gap: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
});
