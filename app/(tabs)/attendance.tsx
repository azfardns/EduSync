import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Users, MapPin, Clock } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [geoRequired, setGeoRequired] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const handleGenerateQR = () => {
    if (!selectedCourse) return;
    
    // Generate QR code data with expiry time and optional geo requirement
    const qrData = {
      courseId: selectedCourse.id,
      timestamp: new Date().getTime(),
      expiryTime: new Date().getTime() + (5 * 60 * 1000), // 5 minutes expiry
      geoRequired,
      instructorId: user.id
    };
    
    setQrGenerated(true);
  };

  const renderInstructorView = () => (
    <ScrollView style={styles.content}>
      {!qrGenerated ? (
        <>
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Select Course</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.courseList}
            >
              {courses.map(course => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseItem,
                    selectedCourse?.id === course.id && styles.selectedCourseItem,
                    isDark && styles.courseItemDark,
                    selectedCourse?.id === course.id && isDark && styles.selectedCourseItemDark
                  ]}
                  onPress={() => setSelectedCourse(course)}
                >
                  <Text 
                    style={[
                      styles.courseItemText,
                      selectedCourse?.id === course.id && styles.selectedCourseItemText,
                      isDark && styles.textDark
                    ]}
                  >
                    {course.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Settings</Text>
            <TouchableOpacity
              style={[
                styles.settingItem,
                geoRequired && styles.settingItemActive,
                isDark && styles.settingItemDark,
                geoRequired && isDark && styles.settingItemActiveDark
              ]}
              onPress={() => setGeoRequired(!geoRequired)}
            >
              <MapPin size={20} color={geoRequired ? '#4361EE' : isDark ? '#BBBBBB' : '#666666'} />
              <View style={styles.settingContent}>
                <Text 
                  style={[
                    styles.settingTitle,
                    geoRequired && styles.settingTitleActive,
                    isDark && styles.textDark
                  ]}
                >
                  Require Location
                </Text>
                <Text style={[styles.settingDescription, isDark && styles.textLightDark]}>
                  Students must be within campus range
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              !selectedCourse && styles.generateButtonDisabled
            ]}
            onPress={handleGenerateQR}
            disabled={!selectedCourse}
          >
            <QrCode size={24} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={[styles.qrContainer, isDark && styles.qrContainerDark]}>
          <Text style={[styles.qrTitle, isDark && styles.textDark]}>
            Attendance QR Code
          </Text>
          <Text style={[styles.qrSubtitle, isDark && styles.textLightDark]}>
            {selectedCourse?.title}
          </Text>
          
          <View style={[styles.qrCode, isDark && styles.qrCodeDark]}>
            {/* QR Code would be rendered here */}
            <View style={styles.qrPlaceholder} />
          </View>
          
          <View style={styles.qrInfo}>
            <View style={styles.qrInfoItem}>
              <Clock size={16} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.qrInfoText, isDark && styles.textLightDark]}>
                Valid for 5 minutes
              </Text>
            </View>
            {geoRequired && (
              <View style={styles.qrInfoItem}>
                <MapPin size={16} color={isDark ? '#BBBBBB' : '#666666'} />
                <Text style={[styles.qrInfoText, isDark && styles.textLightDark]}>
                  Location verification required
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.qrActions}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => setQrGenerated(false)}
            >
              <Text style={styles.refreshButtonText}>Generate New Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.attendanceButton}
              onPress={() => {/* View attendance list */}}
            >
              <Users size={18} color="#4361EE" />
              <Text style={styles.attendanceButtonText}>View Attendees</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderStudentView = () => (
    <View style={styles.content}>
      <View style={[styles.scanCard, isDark && styles.scanCardDark]}>
        <QrCode size={64} color={isDark ? '#BBBBBB' : '#666666'} />
        <Text style={[styles.scanTitle, isDark && styles.textDark]}>
          Scan Attendance QR Code
        </Text>
        <Text style={[styles.scanSubtitle, isDark && styles.textLightDark]}>
          Point your camera at the QR code displayed by your instructor
        </Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {/* Handle scan */}}
        >
          <QrCode size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Attendance</Text>
      </View>
      
      {isInstructor ? renderInstructorView() : renderStudentView()}
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  courseList: {
    paddingVertical: 4,
  },
  courseItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  courseItemDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  selectedCourseItem: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  selectedCourseItemDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  courseItemText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedCourseItemText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  settingItemDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  settingItemActive: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  settingItemActiveDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  settingContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  settingTitleActive: {
    color: '#4361EE',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
  },
  generateButton: {
    backgroundColor: '#4361EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDisabled: {
    backgroundColor: '#A1B1F8',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  qrContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  qrCode: {
    width: 240,
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  qrCodeDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  qrPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  qrInfo: {
    width: '100%',
    marginBottom: 24,
  },
  qrInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrInfoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  qrActions: {
    width: '100%',
  },
  refreshButton: {
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  attendanceButtonText: {
    color: '#4361EE',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  scanCardDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#4361EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});