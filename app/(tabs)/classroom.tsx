import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, BookOpen, Plus, Sparkles } from 'lucide-react-native';
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
      {/* Removed the plus button from the top action container */}
      
      <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'attendance' && styles.activeTab]}
          onPress={() => setActiveTab('attendance')}
          activeOpacity={0.8}
        >
          <QrCode
            size={20}
            color={activeTab === 'attendance' ? '#FF6F61' : isDark ? '#666666' : '#BBBBBB'}
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
          style={[styles.tab, activeTab === 'coursework' && styles.activeTab]}
          onPress={() => setActiveTab('coursework')}
          activeOpacity={0.8}
        >
          <BookOpen
            size={20}
            color={activeTab === 'coursework' ? '#4361EE' : isDark ? '#666666' : '#BBBBBB'}
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
          {/* Creative plus button integrated into coursework tab */}
          {isInstructor && activeTab === 'coursework' && (
            <TouchableOpacity
              style={[styles.creativeAddButton, isDark && styles.creativeAddButtonDark]}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <Sparkles size={14} color="#FFFFFF" />
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'attendance' ? (
          <View style={[styles.attendanceContainer, isDark && styles.attendanceContainerDark]}>
            {isInstructor ? (
              <>
                <QrCode size={48} color={isDark ? '#FFFFFF' : '#FF6F61'} />
                <Text style={[styles.attendanceTitle, isDark && styles.textDark]}>
                  Start Attendance Session
                </Text>
                <Text style={[styles.attendanceSubtitle, isDark && styles.textLightDark]}>
                  Generate a QR code for students to scan
                </Text>
                <TouchableOpacity style={[styles.generateButton, isDark && styles.generateButtonDark]} activeOpacity={0.8}>
                  <Text style={styles.generateButtonText}>Generate QR Code</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <QrCode size={48} color={isDark ? '#FFFFFF' : '#FF6F61'} />
                <Text style={[styles.attendanceTitle, isDark && styles.textDark]}>
                  Scan Attendance QR Code
                </Text>
                <Text style={[styles.attendanceSubtitle, isDark && styles.textLightDark]}>
                  Point your camera at the QR code displayed by your instructor
                </Text>
                <TouchableOpacity style={[styles.scanButton, isDark && styles.scanButtonDark]} activeOpacity={0.8}>
                  <Text style={styles.scanButtonText}>Start Scanning</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <CourseworkList location="classroom" />
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
    backgroundColor: '#F9F9F9',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 4,
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBarDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: '700',
  },
  textDark: {
    color: '#BBBBBB',
  },
  textLightDark: {
    color: '#888888',
  },
  creativeAddButton: {
    position: 'absolute',
    right: 8,
    top: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  creativeAddButtonDark: {
    backgroundColor: '#7209B7',
    shadowColor: '#7209B7',
  },
  content: {
    flex: 1,
  },
  attendanceContainer: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  attendanceContainerDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  attendanceTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    backgroundColor: '#FF6F61',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDark: {
    backgroundColor: '#FF9F1C',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonDark: {
    backgroundColor: '#7209B7',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});