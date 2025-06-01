import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, GraduationCap, ChartBar as BarChart2, Settings } from 'lucide-react-native';
import { AuthProvider } from '@/hooks/useAuth';
import { CoursesProvider } from '@/hooks/useCourses';
import { CourseworkProvider } from '@/hooks/useCoursework';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <AuthProvider>
      <CoursesProvider>
        <CourseworkProvider>
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
                tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
              }}
            />
          </Tabs>
        </CourseworkProvider>
      </CoursesProvider>
    </AuthProvider>
  );
}