import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Chrome as Home, GraduationCap, ChartBar } from 'lucide-react-native';
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
            borderTopWidth: 0,
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            height: 70,
            borderRadius: 35,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            paddingBottom: 0,
            paddingHorizontal: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: false, // Remove header for all tabs
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home Hub',
            tabBarIcon: ({ color, size }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="classroom"
          options={{
            title: 'Classroom',
            tabBarIcon: ({ color, size }) => <GraduationCap size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size }) => <ChartBar size={28} color={color} />,
          }}
        />
      </Tabs>
    </CoursesProvider>
  );
}