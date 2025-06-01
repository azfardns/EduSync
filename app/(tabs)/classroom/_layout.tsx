import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { QrCode, BookOpen, Files, ChartBar } from 'lucide-react-native';

export default function ClassroomLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
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
        name="live-session"
        options={{
          title: 'Live Session',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, size }) => <Files size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <ChartBar size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}