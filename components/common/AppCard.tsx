import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AppCard: React.FC<AppCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, // 10px
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});
