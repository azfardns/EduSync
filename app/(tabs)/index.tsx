import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useCoursework } from '@/hooks/useCoursework';
import { QrCode, Clock, Users, Plus } from 'lucide-react-native';
import DashboardStat from '@/components/dashboard/DashboardStat';
import AddCourseworkModal from '@/components/coursework/AddCourseworkModal';
import CourseworkList from '@/components/coursework/CourseworkList';

export default function HomeScreen() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { courseworks, addCoursework } = useCoursework();
  const [showAddModal, setShowAddModal] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.actionContainer, isDark && styles.actionContainerDark]}>
          {isInstructor && (
            <TouchableOpacity
              style={[styles.addButton, isDark && styles.addButtonDark]}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Plus size={20} color={isDark ? '#FFFFFF' : '#FF6F61'} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsContainer}>
          <DashboardStat
            icon={<Users size={24} color="#FF6F61" />}
            label="Total Students"
            value="156"
            backgroundColor={isDark ? '#2A2A2A' : '#F8EDEB'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Clock size={24} color="#4361EE" />}
            label="Avg. Attendance"
            value="89%"
            backgroundColor={isDark ? '#2A2A2A' : '#E7ECFF'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<QrCode size={24} color="#4CAF50" />}
            label="Active Sessions"
            value="3"
            backgroundColor={isDark ? '#2A2A2A' : '#E6F7ED'}
            isDark={isDark}
          />
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recent Coursework</Text>
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
      <ScrollView style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, isDark && styles.textDark]}>
            Welcome, {user?.name}!
          </Text>
          <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
            Here are your upcoming courseworks
          </Text>
        </View>

        <CourseworkList />
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      {isInstructor ? renderInstructorDashboard() : renderStudentDashboard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  actionContainerDark: {
    backgroundColor: '#121212',
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  section: {
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  sectionDark: {
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});