import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/constants/theme';

const TAB_ICONS: Record<string, { active: any, inactive: any }> = {
  dashboard: { active: 'home', inactive: 'home-outline' },
  tasks: { active: 'checkbox', inactive: 'checkbox-outline' },
  tools: { active: 'build', inactive: 'build-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (options.href === null || !TAB_ICONS[route.name]) return null;

        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const iconInfo = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={isFocused ? iconInfo.active : iconInfo.inactive}
              size={24}
              color={isFocused ? COLORS.primaryLight : COLORS.textSecondary}
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {String(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    height: 65,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  labelActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
});
