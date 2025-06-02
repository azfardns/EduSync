import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, BookOpen, Plus } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useCoursework } from '@/hooks/useCoursework';
import AddCourseworkModal from '@/components/coursework/AddCourseworkModal';
import CourseworkList from '@/components/coursework/CourseworkList';

export default function ClassroomScreen() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'coursework'>('attendance');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const { courses } = useCourses();
  const { addCoursework } = useCoursework();
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
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Classroom</Text>
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

      <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'attendance' && styles.activeTab,
            isDark && styles.tabDark,
            activeTab === 'attendance' && isDark && styles.activeTabDark,
          ]}
          onPress={() => setActiveTab('attendance')}
        >
          <QrCode
            size={20}
            color={activeTab === 'attendance' ? '#4361EE' : isDark ? '#BBBBBB' : '#666666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'attendance' && styles.activeTabText,
              isDark && styles.textDark,
            ]}
          >
            Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'coursework' && styles.activeTab,
            isDark && styles.tabDark,
            activeTab === 'coursework' && isDark && styles.activeTabDark,
          ]}
          onPress={() => setActiveTab('coursework')}
        >
          <BookOpen
            size={20}
            color={activeTab === 'coursework' ? '#4361EE' : isDark ? '#BBBBBB' : '#666666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'coursework' && styles.activeTabText,
              isDark && styles.textDark,
            ]}
          >
            Coursework
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'attendance' ? (
          <View style={[styles.attendanceContainer, isDark && styles.attendanceContainerDark]}>
            {isInstructor ? (
              <>
                <QrCode size={64} color={isDark ? '#BBBBBB' : '#666666'} />
                <Text style={[styles.attendanceTitle, isDark && styles.textDark]}>
                  Start Attendance Session
                </Text>
                <Text style={[styles.attendanceSubtitle, isDark && styles.textLightDark]}>
                  Generate a QR code for students to scan
                </Text>
                <TouchableOpacity style={styles.generateButton}>
                  <Text style={styles.generateButtonText}>Generate QR Code</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <QrCode size={64} color={isDark ? '#BBBBBB' : '#666666'} />
                <Text style={[styles.attendanceTitle, isDark && styles.textDark]}>
                  Scan Attendance QR Code
                </Text>
                <Text style={[styles.attendanceSubtitle, isDark && styles.textLightDark]}>
                  Point your camera at the QR code displayed by your instructor
                </Text>
                <TouchableOpacity style={styles.scanButton}>
                  <Text style={styles.scanButtonText}>Start Scanning</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <CourseworkList />
        )}
      </ScrollView>

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
  textLightDark: {
    color: '#CCCCCC',
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tabBarDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabDark: {
    backgroundColor: '#2A2A2A',
  },
  activeTab: {
    backgroundColor: '#E7ECFF',
  },
  activeTabDark: {
    backgroundColor: '#344181',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  attendanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  attendanceContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  attendanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  attendanceSubtitle: {
    fontSize: 14,
    
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});