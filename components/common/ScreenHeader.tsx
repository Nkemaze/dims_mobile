import { COLORS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  showBell?: boolean;
  showProfile?: boolean;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  onBellPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  showSearch = false,
  showBell = false,
  showProfile = false,
  onSearchPress,
  onProfilePress,
  onBellPress,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress ? onBackPress : () => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightContainer}>
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn}>
            <Ionicons name="search-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity onPress={onProfilePress} style={styles.iconBtn}>
            <Ionicons name="person-circle-outline" size={26} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showBell && (
          <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  title: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
});
