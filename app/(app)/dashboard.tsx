import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppCard } from '@/components/common/AppCard';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const DEPARTMENTS = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'Design' },
  { id: '3', name: 'Marketing' },
  { id: '4', name: 'Finance' },
];

export default function DashboardScreen() {
  const [selectedDept, setSelectedDept] = useState('1');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeLayout>
      <ScreenHeader
        title="Internship Listings"
        showSearch
        showChat
        onSearchPress={() => setShowSearch(!showSearch)}
      />

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Department Filter Bar */}
      <View style={styles.categoryBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryBar}
        >
          {DEPARTMENTS.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              style={[
                styles.categoryBtn,
                selectedDept === dept.id ? styles.categoryBtnActive : styles.categoryBtnInactive,
              ]}
              onPress={() => setSelectedDept(dept.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedDept === dept.id ? styles.categoryTextActive : styles.categoryTextInactive,
                ]}
              >
                {dept.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Available Positions</Text>

        {[1, 2, 3].map((item) => (
          <AppCard key={item} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.logoContainer}>
                <Ionicons name="business" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.jobTitleContainer}>
                <Text style={styles.jobTitle}>Software Engineer Intern</Text>
                <Text style={styles.companyName}>Digimark Consulting Sarl</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3 Months</Text>
              </View>
            </View>

            <Text style={styles.jobDescription} numberOfLines={3}>
              We are looking for a passionate software engineer intern to join our team.
              You will work on exciting projects using the latest technologies.
            </Text>

            <Image
              source={{ uri: 'https://via.placeholder.com/300x150' }}
              style={styles.jobImage}
            />
          </AppCard>
        ))}
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
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
  },
  categoryBarContainer: {
    paddingVertical: SPACING.md,
  },
  categoryBar: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  categoryBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 2,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  categoryBtnInactive: {
    backgroundColor: 'transparent',
    borderColor: COLORS.secondary,
  },
  categoryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  categoryTextInactive: {
    color: COLORS.secondary,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  jobCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  companyName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  jobImage: {
    width: '100%',
    height: 150,
    borderRadius: RADIUS.md,
  },
});
