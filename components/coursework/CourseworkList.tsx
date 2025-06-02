import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useCoursework } from '@/hooks/useCoursework';
import { useCourses } from '@/hooks/useCourses';
import CourseworkItem from '@/components/schedule/CourseworkItem'; // Confirming the import path

export default function CourseworkList({ location = 'home' }) {
  const { courseworks, isLoading } = useCoursework();
  const { courses } = useCourses();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, isDark && styles.textDark]}>Loading...</Text>
      </View>
    );
  }

  if (!courseworks || courseworks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noDataText, isDark && styles.textDark]}>No coursework available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {courseworks.map((coursework) => {
        const course = courses?.find((c) => c.id === coursework.course_id);
        return (
          <CourseworkItem
            key={coursework.id}
            coursework={coursework}
            course={course}
            location={location}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  textDark: {
    color: '#BBBBBB',
  },
});