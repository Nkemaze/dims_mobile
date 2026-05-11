import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { AppInput } from '@/components/common/AppInput';
import { AppSelect } from '@/components/common/AppSelect';
import { AppButton } from '@/components/common/AppButton';
import { COLORS,RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function RegisterInternScreen() {
  const [step, setStep] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [region, setRegion] = useState('');
  const [town, setTown] = useState('');

  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const DUMMY_DEPARTMENTS = [
    { label: 'Computer Science', value: 'CS' },
    { label: 'Software Engineering', value: 'SE' },
    { label: 'Information Technology', value: 'IT' },
    { label: 'Data Science', value: 'DS' },
    { label: 'Cyber Security', value: 'CYBER' },
    { label: 'Business Administration', value: 'BA' },
    { label: 'Marketing', value: 'MKT' },
    { label: 'Accounting', value: 'ACC' },
  ];

  const DUMMY_LEVELS = [
    { label: 'Level 1', value: '1' },
    { label: 'Level 2', value: '2' },
    { label: 'Level 3', value: '3' },
    { label: 'Level 4', value: '4' },
    { label: 'Other', value: '5' },
  ];

  const regionData: Record<string, any> = {
    "adamawa": {
        towns: {
            "Ngaoundéré": ["Bamyanga", "Dang", "Bini", "Tongo Gandima"],
            "Meiganga": ["Meiganga Centre", "Gada-Mabanga", "Djohong"],
            "Tibati": ["Tibati Centre", "Ngaoundal", "Banyo"]
        }
    },
    "center": {
        towns: {
            "Yaoundé": ["Mfoundi", "Ekounou", "Nkolbisson", "Biyem-Assi", "Mvog-Ada", "Essos"],
            "Mbalmayo": ["Akom", "Nkolbisson", "Mbalmayo Centre"],
            "Obala": ["Obala Centre", "Nkolnda", "Nkometou"]
        }
    },
    "east": {
        towns: {
            "Bertoua": ["Bertoua Central", "Mokolo", "Ngaikada"],
            "Abong-Mbang": ["Nkolmetet", "Mbiame", "Nlong"],
            "Batouri": ["Batouri Centre", "Kentzou", "Kette"]
        }
    },
    "far_north": {
        towns: {
            "Maroua": ["Domayo", "Pitoaré", "Doualaré", "Salak"],
            "Kousséri": ["Kousséri Centre", "Madina", "Goulfey"],
            "Mora": ["Mora Centre", "Kolofata", "Tokombéré"]
        }
    },
    "littoral": {
        towns: {
            "Douala": ["Akwa", "Bonaberi", "Deido", "Logbaba", "New Bell"],
            "Nkongsamba": ["Nkongsamba 1", "Nkongsamba 2", "Nkongsamba 3"],
            "Manjo": ["Manjo Centre", "Mbanga", "Loum"]
        }
    },
    "north": {
        towns: {
            "Garoua": ["Plateau", "Poumpoumré", "Laindé", "Bocklé"],
            "Guider": ["Guider Centre", "Figuil", "Mayo Oulo"],
            "Pitoa": ["Pitoa Centre", "Demsa", "Beka"]
        }
    },
    "northwest": {
        towns: {
            "Bamenda": ["Mokolo", "Nkwen", "Nkwen Central", "Mankon", "Mile 2"],
            "Kumbo": ["Kumbo Central", "Mbve", "Tobin"],
            "Ndop": ["Bamunka", "Bambalang", "Bamali"]
        }
    },
    "south": {
        towns: {
            "Ebolowa": ["Ebolowa I", "Ebolowa II", "Nko'ovos"],
            "Kribi": ["Kribi I", "Kribi II", "Grand Batanga"],
            "Sangmélima": ["Sangmélima Centre", "Nkolandom", "Oveng"]
        }
    },
    "southwest": {
        towns: {
            "Buea": ["Molyko", "Muea", "Great Soppo", "Buea Town"],
            "Limbe": ["Bota", "Mile 1", "Mile 2", "Limbe 2"],
            "Kumba": ["Kumba Town", "Fiango", "Kosala"]
        }
    },
    "west": {
        towns: {
            "Bafoussam": ["Manga", "Tamdja", "Banego", "Djeleng"],
            "Dschang": ["Dschang Centre", "Fongo-Tongo", "Fokoué"],
            "Mbouda": ["Mbouda Centre", "Babadjou", "Batcham"]
        }
    }
  };

  const regionOptions = Object.keys(regionData).map(key => ({
    label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: key
  }));

  const townOptions = (region && regionData[region])
    ? Object.keys(regionData[region].towns).map(townName => ({
        label: townName,
        value: townName
      }))
    : [];

  const handleRegionSelect = (val: string) => {
    setRegion(val);
    setTown('');
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  const nextStep = () => {
    if (step === 1 && !name) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (step === 4) {
      if (!email || !phone) {
        Alert.alert('Error', 'Please enter both email and phone number');
        return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const result = await signup({
      email,
      password,
      name,
      phonenumber: phone
    });

    if (result.success) {
      Alert.alert('Success', 'Account created successfully! Please verify your email.', [
        { text: 'Verify Now', onPress: () => router.push({ pathname: '/(auth)/verify-code', params: { email } }) }
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5].map((s) => (
        <View
          key={s}
          style={[
            styles.stepDot,
            s <= step ? styles.stepDotActive : styles.stepDotInactive
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#ffffff', '#ffeacaff', '#ffe6bfff']}
      style={styles.gradient}
    >
      <SafeLayout scrollable={true} style={styles.safeArea} contentStyle={styles.container}>
        <ScreenHeader title="Register as an Intern" showBack/>

        <ScrollView contentContainerStyle={styles.container}>
          {renderStepIndicator()}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Step 1: Present yourself</Text>
              <AppInput
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) clearError();
                }}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                <View pointerEvents="none">
                  <AppInput 
                    label="Date of Birth" 
                    placeholder="DD/MM/YYYY" 
                    value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ''}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              )}
              <AppButton title="Next Step" onPress={nextStep} />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Step 2: Academic Details</Text>
              <AppInput label="University / Institute" placeholder="Enter your university" />
              <AppSelect 
                label="Department/Specialty" 
                placeholder="Select your major" 
                options={DUMMY_DEPARTMENTS} 
                value={department} 
                onSelect={setDepartment} 
                searchable 
              />
              <AppSelect 
                label="Level" 
                placeholder="Select your level" 
                options={DUMMY_LEVELS} 
                value={level} 
                onSelect={setLevel} 
              />
              <View style={styles.btnRow}>
                <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
                <AppButton title="Next Step" onPress={nextStep} style={styles.halfBtn} />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Step 3: Where do you live</Text>
              <AppSelect 
                label="Region" 
                placeholder="Select your region" 
                options={regionOptions} 
                value={region} 
                onSelect={handleRegionSelect} 
                searchable 
              />
              <AppSelect 
                label="Town" 
                placeholder="Select your town" 
                options={townOptions} 
                value={town} 
                onSelect={setTown} 
                searchable 
              />
              <AppInput label="Quater" placeholder="Enter your Quater"/>
              <View style={styles.btnRow}>
                <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
                <AppButton title="Next Step" onPress={nextStep} style={styles.halfBtn} />
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Step 4: Live your contact</Text>
              <AppInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) clearError();
                }}
              />
              <AppInput
                label="Phone Number"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <View style={styles.btnRow}>
                <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
                <AppButton title="Next Step" onPress={nextStep} style={styles.halfBtn} />
              </View>
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Step 5: Create Password</Text>
              <AppInput
                label="Password"
                placeholder="Create a password"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
              <AppInput
                label="Confirm Password"
                placeholder="Confirm your password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <View style={styles.btnRow}>
                <AppButton title="Back" variant="outline" onPress={prevStep} style={styles.halfBtn} />
                <AppButton
                  title="Submit"
                  onPress={handleSubmit}
                  style={styles.halfBtn}
                  isLoading={isLoading}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeLayout>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  stepIndicator: {
    paddingTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  gradient: {
    flex: 1,
    width: '100%',
    paddingVertical: SPACING.xl,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  stepDotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginHorizontal: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  stepContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: SPACING.lg,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  halfBtn: {
    flex: 1,
  }
});
