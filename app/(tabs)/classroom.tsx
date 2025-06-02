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
  const isDark = true; // Force dark theme

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classroom</Text>
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

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'attendance' && styles.activeTab]}
          onPress={() => setActiveTab('attendance')}
        >
          <QrCode
            size={20}
            color={activeTab === 'attendance' ? '#FFFFFF' : '#BBBBBB'}
          />
          <Text
            style={[styles.tabText, activeTab === 'attendance' && styles.activeTabText]}
          >
            Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'coursework' && styles.activeTab]}
          onPress={() => setActiveTab('coursework')}
        >
          <BookOpen
            size={20}
            color={activeTab === 'coursework' ? '#FFFFFF' : '#BBBBBB'}
          />
          <Text
            style={[styles.tabText, activeTab === 'coursework' && styles.activeTabText]}
          >
            Coursework
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'attendance' ? (
          <View style={styles.attendanceContainer}>
            {isInstructor ? (
              <>
                <QrCode size={64} color="#FFFFFF" />
                <Text style={styles.attendanceTitle}>Start Attendance Session</Text>
                <Text style={styles.attendanceSubtitle}>
                  Generate a QR code for students to scan
                </Text>
                <TouchableOpacity style={styles.generateButton}>
                  <Text style={styles.generateButtonText}>Generate QR Code</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <QrCode size={64} color="#FFFFFF" />
                <Text style={styles.attendanceTitle}>Scan Attendance QR Code</Text>
                <Text style={styles.attendanceSubtitle}>
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
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 4,
    backgroundColor: '#1A1A1A',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'linear-gradient(135deg, #4361EE 0%, #7209B7 100%)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BBBBBB',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  attendanceContainer: {
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  attendanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  attendanceSubtitle: {
    fontSize: 14,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: 'linear-gradient(135deg, #4361EE 0%, #7209B7 100%)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: 'linear-gradient(135deg, #4361EE 0%, #7209B7 100%)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});