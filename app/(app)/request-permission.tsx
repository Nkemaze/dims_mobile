import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';

export default function RequestPermissionScreen() {
  const router = useRouter();
  const { intern } = useAuthStore();
  const { createPermission, isSubmitting } = usePermissionStore();

  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Validation', 'Please enter a reason for your leave.');
      return;
    }
    if (!fromDate) {
      Alert.alert('Validation', 'Please select a start date.');
      return;
    }
    if (!intern?.id) {
      Alert.alert('Error', 'Intern data not loaded. Please try again.');
      return;
    }

    const success = await createPermission({
      intern_id: intern.id,
      reason: reason.trim(),
      start_date: fromDate.toISOString(),
      end_date: toDate ? toDate.toISOString() : null,
    });

    if (success) {
      Alert.alert('Success', 'Permission request submitted successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <SafeLayout>
      <ScreenHeader title="Request Leave" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <AppInput
          label="Reason for leave"
          placeholder="Briefly explain your reason..."
          value={reason}
          onChangeText={setReason}
        />

        {/* Start Date */}
        <TouchableOpacity onPress={() => setShowFromPicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <AppInput
              label="Start Date"
              placeholder="Tap to select..."
              value={fromDate ? fromDate.toLocaleString() : ''}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              setShowFromPicker(Platform.OS === 'ios');
              if (date) setFromDate(date);
            }}
            minimumDate={new Date()}
          />
        )}

        {/* End Date */}
        <TouchableOpacity onPress={() => setShowToPicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <AppInput
              label="End Date (optional)"
              placeholder="Tap to select..."
              value={toDate ? toDate.toLocaleString() : ''}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate || fromDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              setShowToPicker(Platform.OS === 'ios');
              if (date) setToDate(date);
            }}
            minimumDate={fromDate || new Date()}
          />
        )}

        <AppButton
          title="Submit Request"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  submitBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
});
