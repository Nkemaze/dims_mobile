import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SafeLayout } from '@/components/layout/SafeLayout';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { usePermissionStore } from '@/store/permissionStore';
import { PermissionRequest } from '@/types/permission.types';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function PermissionsScreen() {
  const router = useRouter();
  const { intern } = useAuthStore();
  const { permissions, isLoading, error, fetchPermissions } = usePermissionStore();
  const [refreshing, setRefreshing] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    actions: [] as { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]
  });

  const showModal = (title: string, message: string, actions?: { text: string; onPress: () => void; variant?: 'primary' | 'outline' }[]) => {
    setModalConfig({
      visible: true,
      title,
      message,
      actions: actions || [{ text: 'OK', onPress: () => setModalConfig(prev => ({ ...prev, visible: false })), variant: 'primary' }]
    });
  };

  const load = useCallback(() => {
    if (intern?.id) fetchPermissions(intern.id);
  }, [intern?.id, fetchPermissions]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (error) {
      showModal('Error', error);
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPermissions(intern?.id ?? '');
    setRefreshing(false);
    showModal('Success', 'Permissions refreshed successfully!');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return { bg: '#e8f5e9', text: '#2e7d32', label: 'Approved' };
      case 'rejected': return { bg: '#ffebee', text: '#c62828', label: 'Rejected' };
      default:         return { bg: '#fff8e1', text: '#f57f17', label: 'Pending' };
    }
  };

  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const renderItem = ({ item }: { item: PermissionRequest }) => {
    const statusStyle = getStatusStyle(item.status);
    const startDate = parseDate(item.start_date);
    const endDate = parseDate(item.end_date);
    
    return (
      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>From</Text>
            <Text style={styles.dateValue}>
              {startDate ? format(startDate, 'MMM dd, yyyy HH:mm') : 'Invalid date'}
            </Text>
            {endDate && (
              <>
                <Text style={[styles.dateLabel, { marginTop: 4 }]}>To</Text>
                <Text style={styles.dateValue}>
                  {format(endDate, 'MMM dd, yyyy HH:mm')}
                </Text>
              </>
            )}
          </View>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>
        <Text style={styles.reasonText}>{item.reason}</Text>
      </AppCard>
    );
  };

  if (isLoading && !refreshing) return <LoadingSpinner fullScreen />;

  return (
    <SafeLayout scrollable={false}>
      <ScreenHeader
        title="My Permissions"
        showBack
        onBackPress={() => router.push('/(app)/profile' as any)}
      />
      <Modal visible={modalConfig.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalText}>{modalConfig.message}</Text>
            <View style={styles.modalActions}>
              {modalConfig.actions.map((action, index) => (
                <AppButton
                  key={index}
                  title={action.text}
                  onPress={action.onPress}
                  variant={action.variant || 'primary'}
                  style={styles.modalBtn}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={[...permissions]
          .filter(p => p.start_date)
          .sort(
            (a, b) => {
              const dateA = new Date(a.start_date).getTime();
              const dateB = new Date(b.start_date).getTime();
              return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
            }
          )
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AppButton
            title="+ Request Permission"
            onPress={() => router.push('/(app)/request-permission' as any)}
            style={styles.requestBtn}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No Requests Yet"
            message="You haven't submitted any permission requests."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
    flexGrow: 1,
  },
  requestBtn: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  card: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  dateBlock: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  dateLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '85%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  modalText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  modalActions: {
    gap: SPACING.sm,
  },
  modalBtn: {
    width: '100%',
  },
});
