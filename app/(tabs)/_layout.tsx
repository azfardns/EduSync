import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, GraduationCap, ChartBar } from 'lucide-react-native';
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
            title: 'Home Hub',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="classroom"
          options={{
            title: 'Classroom',
            tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size }) => <ChartBar size={size} color={color} />,
          }}
        />
      </Tabs>
    </CoursesProvider>
  );
}