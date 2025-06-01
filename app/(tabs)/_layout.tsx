import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, QrCode, ChartBar as BarChart2, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { CoursesProvider } from '@/hooks/useCourses';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <CoursesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4361EE',
          tabBarInactiveTintColor: isDark ? '#CCCCCC' : '#888888',
          tabBarStyle: {
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            borderTopColor: isDark ? '#333333' : '#EEEEEE',
          },
          headerStyle: {
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          },
          headerTintColor: isDark ? 'white' : '#333',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: 'Classroom',
            tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </CoursesProvider>
  );
}