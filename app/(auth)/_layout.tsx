import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ 
          headerShown: true, 
          title: 'Reset Password',
          headerTitleAlign: 'center'
        }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
