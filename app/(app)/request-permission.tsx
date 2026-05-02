import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function RequestPermissionScreen() {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 1500);
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

        <TouchableOpacity onPress={() => setShowFromPicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <AppInput 
              label="Start Date" 
              placeholder="DD/MM/YYYY" 
              value={fromDate ? fromDate.toLocaleDateString() : ''}
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

        <TouchableOpacity onPress={() => setShowToPicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <AppInput 
              label="End Date" 
              placeholder="DD/MM/YYYY" 
              value={toDate ? toDate.toLocaleDateString() : ''}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate || new Date()}
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
  }
});
