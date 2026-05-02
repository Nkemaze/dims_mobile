import React, { useState } from 'react';
import { View, Text, StyleSheet,TextInput } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';

export default function ToolsScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeLayout>
      <ScreenHeader title="Tools" 
        showBell 
        showSearch 
        onSearchPress={() => setShowSearch(!showSearch)} 
      />
      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tool..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
      <View style={styles.container}>
        <Ionicons name="build" size={100} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.title}>You have no tools available for now</Text>
        <Text style={styles.subtitle}>Check back later for new tools and features.</Text>
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  icon: {
    opacity: 0.2,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
