import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Modal, TextInput } from 'react-native';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { COLORS, RADIUS, SPACING, FONTS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { formatShortDate } from '@/utils/formatters';

export default function ProfileScreen() {

  const { user, intern, logout } = useAuthStore();

  const router = useRouter();

  const [deleteStep, setDeleteStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');

  const handleSignOut = () => {
    router.replace('/(auth)/login' as any);
  };

  const handleStartDelete = () => {
    setDeleteStep(1);
    setEnteredCode('');
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(randomCode);
  };

  const handleConfirmDelete = () => {
    if (enteredCode !== generatedCode) return;
    setDeleteStep(0);
    router.replace('/(auth)/login' as any);
  };

  const menuItems = [
    { title: 'Track your progress', icon: 'trending-up', color: COLORS.primary, route: '/(app)/progress' },
    { title: 'Track your attendance', icon: 'calendar', color: COLORS.primary, route: '/(app)/attendance' },
    { title: 'Timetable management', icon: 'time', color: COLORS.primary, route: '/(app)/timetable' },
    { title: 'Permission Management', icon: 'document-text', color: COLORS.primary, route: '/(app)/permissions' },
    { title: 'Manage Your Payments', icon: 'card', color: COLORS.primary, route: '/(app)/payment' },
    { title: 'About Us', icon: 'information-circle', color: COLORS.primary, url: 'https://www.digimarkconsulting.cm' },
  ];

  console.log(intern)

  return (
    <SafeLayout>
      <ScreenHeader title="Profile" />

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}> {intern?.fullname} </Text>
        <Text style={styles.department}> {intern?.department} </Text>
        <Text style={styles.internSince}>Interns Since: {formatShortDate(intern?.created_at)}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => {
              if (item.url) {
                Linking.openURL(item.url);
              } else if (item.route) {
                router.push(item.route as any);
              }
            }}
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
          style={[styles.menuItem, { backgroundColor: '#c62828' }]}
          onPress={handleStartDelete}
        >
          <View style={styles.menuItemLeft}>
             <Ionicons name="trash" size={24} color={COLORS.white} />
             <Text style={styles.menuItemText}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Account Deletion Modals */}
      <Modal visible={deleteStep === 1} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color="#c62828" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>
              Do you really want to delete your account?
            </Text>
            <View style={styles.modalActions}>
              <AppButton title="Cancel" onPress={() => setDeleteStep(0)} style={styles.btnSecondary} textStyle={{color: COLORS.primary}} />
              <AppButton title="Yes, Continue" onPress={() => setDeleteStep(2)} style={styles.btnPrimary} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteStep === 2} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle" size={48} color="#c62828" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Critical Warning</Text>
            <Text style={styles.modalText}>
              This action CANNOT be undone. All your progress and permissions will be lost permanently.
            </Text>
            <View style={styles.modalActions}>
              <AppButton title="Cancel" onPress={() => setDeleteStep(0)} style={styles.btnSecondary} textStyle={{color: COLORS.primary}} />
              <AppButton title="I Understand" onPress={() => setDeleteStep(3)} style={styles.btnPrimary} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteStep === 3} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Final Verification</Text>
            <Text style={styles.modalText}>
              Please enter the generated code below to confirm deletion.
            </Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{generatedCode}</Text>
            </View>
            <TextInput 
              style={styles.verifyInput}
              placeholder="Enter code here"
              value={enteredCode}
              onChangeText={setEnteredCode}
              autoCapitalize="characters"
              maxLength={6}
            />
            <View style={styles.modalActions}>
              <AppButton title="Cancel" onPress={() => setDeleteStep(0)} style={styles.btnSecondary} textStyle={{color: COLORS.primary}} />
              <AppButton 
                title="Delete My Account" 
                onPress={handleConfirmDelete} 
                disabled={enteredCode !== generatedCode}
                style={[styles.btnDanger, enteredCode !== generatedCode && { opacity: 0.5 }] as any} 
              />
            </View>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  codeBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
    color: COLORS.textPrimary,
  },
  verifyInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
    marginTop: SPACING.md,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: COLORS.primary,
  },
  btnDanger: {
    flex: 1,
    backgroundColor: '#c62828',
  }
});
