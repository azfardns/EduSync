import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BookOpen, Clock, User } from 'lucide-react-native';

type CourseProps = {
  id: string;
  title: string;
  code: string;
  instructor: string;
  schedule: string;
  isEnrolled?: boolean;
  isDark?: boolean;
};

const CourseCard: React.FC<CourseProps> = ({
  title,
  code,
  instructor,
  schedule,
  isEnrolled = false,
  isDark = false,
}) => {
  const handleEnrollment = () => {
    Alert.alert(
      isEnrolled ? 'Unenroll from Course' : 'Enroll in Course',
      `Are you sure you want to ${isEnrolled ? 'unenroll from' : 'enroll in'} ${title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Success',
              `Successfully ${isEnrolled ? 'unenrolled from' : 'enrolled in'} ${title}`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDark && styles.textDark]}>{title}</Text>
          <Text style={[styles.code, isDark && styles.textLightDark]}>{code}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.enrollButton,
            isEnrolled ? styles.unenrollButton : styles.enrollButtonActive,
          ]}
          onPress={handleEnrollment}
        >
          <Text style={styles.enrollButtonText}>
            {isEnrolled ? 'Unenroll' : 'Enroll'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <User size={16} color={isDark ? '#BBBBBB' : '#666666'} />
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            {instructor}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color={isDark ? '#BBBBBB' : '#666666'} />
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            {schedule}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  code: {
    fontSize: 14,
    color: '#666666',
  },
  enrollButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  enrollButtonActive: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  unenrollButton: {
    backgroundColor: '#FFEBEB',
    borderColor: '#FF6B6B',
  },
  enrollButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4361EE',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
});

export default CourseCard;