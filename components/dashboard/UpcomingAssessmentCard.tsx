import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

type Assessment = {
  id: string;
  title: string;
  date: string;
  duration: string;
  courseTitle: string;
  type: string;
};

type UpcomingAssessmentCardProps = {
  assessment: Assessment;
  isDark?: boolean;
};

const UpcomingAssessmentCard: React.FC<UpcomingAssessmentCardProps> = ({ 
  assessment,
  isDark = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <TouchableOpacity style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>{assessment.title}</Text>
        <View style={[
          styles.typeTag,
          assessment.type === 'Exam' ? styles.examTag : 
          assessment.type === 'Quiz' ? styles.quizTag : styles.assignmentTag
        ]}>
          <Text style={styles.typeText}>{assessment.type}</Text>
        </View>
      </View>
      
      <Text style={[styles.courseTitle, isDark && styles.textLightDark]}>
        {assessment.courseTitle}
      </Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={isDark ? '#BBBBBB' : '#666666'} />
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            {formatDate(assessment.date)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Clock size={16} color={isDark ? '#BBBBBB' : '#666666'} />
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            {assessment.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 8,
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
  assignmentTag: {
    backgroundColor: '#E6F7ED',
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
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
});

export default UpcomingAssessmentCard;