import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/layout/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

      {/* Hidden from tab bar */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="task-detail" options={{ href: null }} />
      <Tabs.Screen name="attendance" options={{ href: null }} />
      <Tabs.Screen name="timetable" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="permissions" options={{ href: null }} />
      <Tabs.Screen name="request-permission" options={{ href: null }} />
      <Tabs.Screen name="payment" options={{ href: null }} />
    </Tabs>
  );
}
