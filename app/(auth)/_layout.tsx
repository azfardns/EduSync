import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: isDark ? 'white' : '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: isDark ? '#121212' : '#F5F5F5',
        },
      }}>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
          headerShown: false,
        }}
      />
    </Stack>
  );
}