import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useCoursework } from '@/hooks/useCoursework';
import { ListFilter as Filter, ChevronDown, QrCode, Download, Clock, Users, Plus } from 'lucide-react-native';
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
  const isDark = colorScheme === 'dark';
  
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  // Filter courseworks based on selected criteria
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
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.filterButton, isDark && styles.filterButtonDark]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <View style={[styles.filtersContainer, isDark && styles.filtersContainerDark]}>
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, isDark && styles.textDark]}>Course:</Text>
            <TouchableOpacity 
              style={[styles.filterSelector, isDark && styles.filterSelectorDark]}
              onPress={() => {/* Show course selection */}}
            >
              <Text style={[styles.filterSelectorText, isDark && styles.textDark]}>
                {selectedCourse ? selectedCourse.title : 'All Courses'}
              </Text>
              <ChevronDown size={16} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, isDark && styles.textDark]}>Type:</Text>
            <View style={styles.typeOptions}>
              {['Quiz', 'Exam', 'Assignment'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    selectedType === type && styles.typeOptionSelected,
                    isDark && styles.typeOptionDark,
                    selectedType === type && isDark && styles.typeOptionSelectedDark
                  ]}
                  onPress={() => setSelectedType(selectedType === type ? null : type)}
                >
                  <Text 
                    style={[
                      styles.typeOptionText,
                      selectedType === type && styles.typeOptionTextSelected,
                      isDark && styles.textDark
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <DashboardStat
            icon={<Users size={24} color={isDark ? '#4361EE' : '#4361EE'} />}
            label="Total Students"
            value="156"
            backgroundColor={isDark ? '#2A2A2A' : '#E7ECFF'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<Clock size={24} color={isDark ? '#4CAF50' : '#4CAF50'} />}
            label="Avg. Attendance"
            value="89%"
            backgroundColor={isDark ? '#2A2A2A' : '#E6F7ED'}
            isDark={isDark}
          />
          <DashboardStat
            icon={<QrCode size={24} color={isDark ? '#FF9F1C' : '#FF9F1C'} />}
            label="Active Sessions"
            value="3"
            backgroundColor={isDark ? '#2A2A2A' : '#FFF8E1'}
            isDark={isDark}
          />
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Recent Coursework
            </Text>
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
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Home</Text>
      </View>

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filterButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
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
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filtersContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  filterSelector: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filterSelectorDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  filterSelectorText: {
    fontSize: 14,
    color: '#333333',
  },
  typeOptions: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  typeOptionDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  typeOptionSelected: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  typeOptionSelectedDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  typeOptionTextSelected: {
    color: '#4361EE',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
});