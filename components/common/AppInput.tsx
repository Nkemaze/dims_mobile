import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  isPassword = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        isFocused ? styles.inputFocused : null
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 12
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});
