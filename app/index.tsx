import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Restore auth guard when backend is ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Redirect href={'/(auth)/login' as any} />;
}

