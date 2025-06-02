import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Clock, Calendar, BookOpen, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useCoursework } from '@/hooks/useCoursework';
import { useCourses } from '@/hooks/useCourses';

export default function CourseworkList() {
  const { courseworks, deleteCoursework } = useCoursework();
  const { courses } = useCourses();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoursework(id);
    } catch (error) {
      console.error('Error deleting coursework:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {courseworks.map((coursework) => (
        <View
          key={coursework.id}
          style={[styles.card, isDark && styles.cardDark]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, isDark && styles.textDark]}>
                {coursework.title}
              </Text>
              <Text style={[styles.courseTitle, isDark && styles.textLightDark]}>
                {getCourseTitle(coursework.course_id)}
              </Text>
            </View>
            <View style={[
              styles.typeTag,
              coursework.type === 'Exam' ? styles.examTag :
              coursework.type === 'Quiz' ? styles.quizTag :
              styles.projectTag
            ]}>
              <Text style={styles.typeText}>{coursework.type}</Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.detailText, isDark && styles.textLightDark]}>
                Start: {formatDateTime(coursework.start_time)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={16} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.detailText, isDark && styles.textLightDark]}>
                End: {formatDateTime(coursework.end_time)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <BookOpen size={16} color={isDark ? '#BBBBBB' : '#666666'} />
              <Text style={[styles.detailText, isDark && styles.textLightDark]}>
                {coursework.submission_method === 'online' ? 'Online Submission' : 'Offline Submission'}
              </Text>
            </View>
          </View>

          {user?.role === 'instructor' && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(coursework.id)}
              >
                <Trash2 size={16} color="#FF6B6B" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardDark: {
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
  courseTitle: {
    fontSize: 14,
    color: '#666666',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  examTag: {
    backgroundColor: '#FFEBEB',
  },
  quizTag: {
    backgroundColor: '#E7ECFF',
  },
  projectTag: {
    backgroundColor: '#E6F7ED',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  details: {
    marginTop: 12,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEB',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#CCCCCC',
  },
});