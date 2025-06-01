import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import AddCourseworkModal from '@/components/coursework/AddCourseworkModal';
import CourseworkList from '@/components/coursework/CourseworkList';
import { useCoursework } from '@/hooks/useCoursework';
import { useCourses } from '@/hooks/useCourses';

export default function CourseworkScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const { addCoursework } = useCoursework();
  const { courses } = useCourses();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const handleAddCoursework = async (coursework: any) => {
    try {
      await addCoursework(coursework);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding coursework:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Coursework</Text>
        {isInstructor && (
          <TouchableOpacity
            style={[styles.addButton, isDark && styles.addButtonDark]}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color={isDark ? '#FFFFFF' : '#333333'} />
            <Text style={[styles.addButtonText, isDark && styles.textDark]}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      <CourseworkList />

      {isInstructor && (
        <AddCourseworkModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCoursework}
          courses={courses}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  addButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});