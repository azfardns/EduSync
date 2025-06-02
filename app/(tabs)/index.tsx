import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useCoursework } from '@/hooks/useCoursework';
import { ListFilter as Filter, ChevronDown, QrCode, Clock, Users, Plus } from 'lucide-react-native';
import DashboardStat from '@/components/dashboard/DashboardStat';
import AddCourseworkModal from '@/components/coursework/AddCourseworkModal';
import CourseworkList from '@/components/coursework/CourseworkList';

export default function HomeScreen() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { courseworks, addCoursework } = useCoursework();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = true; // Force dark theme for consistency with iBank inspiration

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const filteredCourseworks = courseworks?.filter(coursework => {
    if (selectedCourse && coursework.course_id !== selectedCourse.id) return false;
    if (selectedType && coursework.type !== selectedType) return false;
    return true;
  }) || [];

  const handleAddCoursework = async (coursework) => {
    try {
      await addCoursework(coursework);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding coursework:', error);
      Alert.alert('Error', 'Failed to add coursework. Please try again.');
    }
  };

  const renderInstructorDashboard = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <DashboardStat
            icon={<Users size={24} color="#FFFFFF" />}
            label="Total Students"
            value="156"
            backgroundColor="linear-gradient(135deg, #FF6F61 0%, #FF9F1C 100%)"
            isDark={isDark}
          />
          <DashboardStat
            icon={<Clock size={24} color="#FFFFFF" />}
            label="Avg. Attendance"
            value="89%"
            backgroundColor="linear-gradient(135deg, #4361EE 0%, #7209B7 100%)"
            isDark={isDark}
          />
          <DashboardStat
            icon={<QrCode size={24} color="#FFFFFF" />}
            label="Active Sessions"
            value="3"
            backgroundColor="linear-gradient(135deg, #4CAF50 0%, #2EC4B6 100%)"
            isDark={isDark}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Coursework</Text>
            {isInstructor && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add New</Text>
              </TouchableOpacity>
            )}
          </View>
          <CourseworkList />
        </View>
      </ScrollView>

      <AddCourseworkModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCoursework}
        courses={courses}
      />
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
          <Text style={styles.subtitle}>Here are your upcoming courseworks</Text>
        </View>

        <CourseworkList />
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isInstructor ? renderInstructorDashboard() : renderStudentDashboard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #4361EE 0%, #7209B7 100%)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
  },
});