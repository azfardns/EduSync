// Tab navigation layout managing the main app navigation structure
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, GraduationCap, User } from 'lucide-react-native';
import { CoursesProvider } from '@/hooks/useCourses';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <CoursesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#FF6F61' : '#4361EE',
          tabBarInactiveTintColor: isDark ? '#666666' : '#BBBBBB',
          tabBarStyle: {
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#2A2A2A' : '#E0E0E0',
            height: 60,
            paddingBottom: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="classroom"
          options={{
            title: 'Classroom',
            tabBarIcon: ({ color, size }) => <GraduationCap size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </CoursesProvider>
  );
}