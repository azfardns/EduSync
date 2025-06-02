import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Trash2, Edit2 } from 'lucide-react-native';
import { useCoursework } from '@/hooks/useCoursework';
import { useAuth } from '@/hooks/useAuth';

export default function CourseworkItem({ coursework, course, location }) {
  const { deleteCoursework } = useCoursework();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  const handleDelete = async () => {
    Alert.alert(
      'Delete Coursework',
      `Are you sure you want to delete ${coursework.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCoursework(coursework.id);
            } catch (error) {
              console.error('Error deleting coursework:', error);
              Alert.alert('Error', 'Failed to delete coursework.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert('Edit Coursework', 'Edit functionality not yet implemented.');
  };

  const typeColor = {
    Exam: isDark ? '#FF9F1C' : '#FF6F61',
    Quiz: isDark ? '#7209B7' : '#4361EE',
    Project: isDark ? '#2EC4B6' : '#4CAF50',
    Assignment: isDark ? '#FF9F1C' : '#FF6F61',
  };

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={location === 'classroom' ? () => setIsExpanded(!isExpanded) : null}
      activeOpacity={location === 'classroom' ? 0.8 : 1}
    >
      <View style={[styles.leftDecoration, { backgroundColor: typeColor[coursework.type] }]} />
      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.textDark]}>{coursework.title}</Text>
        <Text style={[styles.courseText, isDark && styles.textLightDark]}>
          {course ? course.title : 'Unknown Course'}
        </Text>
        <View style={styles.tagContainer}>
          <View
            style={[styles.tag, { backgroundColor: typeColor[coursework.type] }]}
          >
            <Text style={styles.tagText}>{coursework.type}</Text>
          </View>
        </View>
        <Text style={[styles.detailText, isDark && styles.textLightDark]}>
          Start: {new Date(coursework.start_time).toLocaleString()}
        </Text>
        <Text style={[styles.detailText, isDark && styles.textLightDark]}>
          End: {new Date(coursework.end_time).toLocaleString()}
        </Text>
        <Text style={[styles.detailText, isDark && styles.textLightDark]}>
          Submission: {coursework.submission_method}
        </Text>

        {location === 'classroom' && isInstructor && isExpanded && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Edit2 size={20} color={isDark ? '#FFFFFF' : '#4361EE'} />
              <Text style={[styles.actionButtonText, isDark && styles.textDark]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, isDark && styles.actionButtonDark]}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Trash2 size={20} color={isDark ? '#FFFFFF' : '#FF6F61'} />
              <Text style={[styles.actionButtonText, isDark && styles.textDark]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#FFFFFF',
  },
  leftDecoration: {
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  courseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonDark: {
    backgroundColor: '#3A3A3A',
    shadowColor: '#FFFFFF',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});