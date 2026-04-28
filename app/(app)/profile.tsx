import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = () => {
    router.replace('/(auth)/login' as any);
  };

  const menuItems = [
    { title: 'Track your progress', icon: 'trending-up', color: '#F17F27', route: '/(app)/dashboard' },
    { title: 'Track your attendance', icon: 'calendar', color: COLORS.primary, route: '/(app)/attendance' },
    { title: 'Timetable management', icon: 'time', color: COLORS.primary, route: '/(app)/timetable' },
    { title: 'Permission Management', icon: 'document-text', color: COLORS.primary, route: '/(app)/profile' },
    { title: 'Manage Your Payments', icon: 'card', color: COLORS.primary, route: '/(app)/profile' },
    { title: 'About Us', icon: 'information-circle', color: COLORS.primary, route: '/(app)/profile' },
  ];

  return (
    <SafeLayout>
      <ScreenHeader title="Profile" showBack />

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>Chukwuemeka Okonkwo</Text>
        <Text style={styles.department}>Software Engineering</Text>
        <Text style={styles.internSince}>Interns Since: 12/10/2024</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuItemLeft}>
               <Ionicons name={item.icon as any} size={24} color={COLORS.white} />
               <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: COLORS.primary }]}
          onPress={handleSignOut}
        >
          <View style={styles.menuItemLeft}>
             <Ionicons name="log-out" size={24} color={COLORS.white} />
             <Text style={styles.menuItemText}>Log Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: COLORS.primary }]}
          onPress={() => {}}
        >
          <View style={styles.menuItemLeft}>
             <Ionicons name="trash" size={24} color={COLORS.white} />
             <Text style={styles.menuItemText}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 3,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  department: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  internSince: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  menuContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    height: 60,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
