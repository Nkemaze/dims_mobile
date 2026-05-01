import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  searchable?: boolean;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  label,
  error,
  placeholder = 'Select...',
  value,
  options,
  onSelect,
  searchable = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = useMemo(() => options.find(o => o.value === value), [value, options]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(lowerQuery));
  }, [options, searchable, searchQuery]);

  const handleSelect = (val: string) => {
    onSelect(val);
    setSearchQuery('');
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[
          styles.inputContainer,
          error ? styles.inputError : null
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.input, !selectedOption && styles.placeholder]} numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBg}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search options..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => item.value + index}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No matching options found</Text>
              }
            />
          </SafeAreaView>
        </View>
      </Modal>
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
    height: 48,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    height: '80%',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    height: '100%',
  },
  clearBtn: {
    padding: SPACING.xs,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionItemSelected: {
    backgroundColor: COLORS.border + '33', // faint background
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  emptyText: {
    padding: SPACING.xl,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
  }
});
