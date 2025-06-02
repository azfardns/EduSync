import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, Clock, Users } from 'lucide-react-native';

type Assessment = {
  id: string;
  title: string;
  courseTitle: string;
  type: string;
  time: string;
  duration: string;
  room?: string;
  instructor?: string;
};

type CourseworkItemProps = {
  assessment: Assessment;
  isDark?: boolean;
};

const CourseworkItem: React.FC<CourseworkItemProps> = ({ 
  assessment,
  isDark = false
}) => {
  return (
    <TouchableOpacity style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.leftDecoration} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>{assessment.title}</Text>
          <View style={[
            styles.typeTag,
            assessment.type === 'Exam' ? styles.examTag : 
            assessment.type === 'Quiz' ? styles.quizTag : 
            assessment.type === 'Lab' ? styles.labTag : styles.lectureTag
          ]}>
            <Text style={styles.typeText}>{assessment.type}</Text>
          </View>
        </View>
        
        <Text style={[styles.courseTitle, isDark && styles.textLightDark]}>
          {assessment.courseTitle}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Clock size={14} color={isDark ? '#BBBBBB' : '#666666'} />
            <Text style={[styles.detailText, isDark && styles.textLightDark]}>
              {assessment.time}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={14} color={isDark ? '#BBBBBB' : '#666666'} />
            <Text style={[styles.detailText, isDark && styles.textLightDark]}>
              {assessment.duration}
            </Text>
          </View>
          
          {assessment.room && (
            <View style={styles.detailItem}>
              <BookOpen size={14} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.detailText, isDark && styles.textLightDark]}>
                {assessment.room}
              </Text>
            </View>
          )}
          
          {assessment.instructor && (
            <View style={styles.detailItem}>
              <Users size={14} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.detailText, isDark && styles.textLightDark]}>
                {assessment.instructor}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  leftDecoration: {
    width: 6,
    backgroundColor: '#4361EE',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  examTag: {
    backgroundColor: '#FFEBEB',
  },
  quizTag: {
    backgroundColor: '#E7ECFF',
  },
  labTag: {
    backgroundColor: '#E6F7ED',
  },
  lectureTag: {
    backgroundColor: '#FFF8E1',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  courseTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});

export default CourseworkItem;