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

  // Enhanced color coding for assessment types
  const getTypeColors = (type: string) => {
    const typeColors = {
      'Test': { 
        bg: isDark ? '#4A4A4A' : '#6B7280', 
        text: '#FFFFFF',
        accent: isDark ? '#6B7280' : '#4B5563'
      },
      'Project': { 
        bg: isDark ? '#0D9488' : '#14B8A6', 
        text: '#FFFFFF',
        accent: isDark ? '#14B8A6' : '#0D9488'
      },
      'Exam': { 
        bg: isDark ? '#DC2626' : '#EF4444', 
        text: '#FFFFFF',
        accent: isDark ? '#EF4444' : '#DC2626'
      },
      'Quiz': { 
        bg: isDark ? '#7C3AED' : '#8B5CF6', 
        text: '#FFFFFF',
        accent: isDark ? '#8B5CF6' : '#7C3AED'
      },
      'Assignment': { 
        bg: isDark ? '#F59E0B' : '#F97316', 
        text: '#FFFFFF',
        accent: isDark ? '#F97316' : '#F59E0B'
      }
    };
    
    return typeColors[type] || typeColors['Assignment'];
  };

  const typeColors = getTypeColors(coursework.type);

  // Determine if card should be interactive
  const isInteractive = location === 'classroom';
  const handlePress = isInteractive ? () => setIsExpanded(!isExpanded) : undefined;

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        isDark && styles.cardDark,
        !isInteractive && styles.nonInteractiveCard
      ]}
      onPress={handlePress}
      activeOpacity={isInteractive ? 0.8 : 1}
      disabled={!isInteractive}
    >
      <View style={[styles.leftDecoration, { backgroundColor: typeColors.accent }]} />
      
      <View style={styles.content}>
        {/* Header with title and type badge aligned */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]} numberOfLines={1}>
            {coursework.title}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}>
            <Text style={[styles.typeBadgeText, { color: typeColors.text }]}>
              {coursework.type}
            </Text>
          </View>
        </View>

        <Text style={[styles.courseText, isDark && styles.textLightDark]}>
          {course ? course.title : 'Unknown Course'}
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            Start: {new Date(coursework.start_time).toLocaleString()}
          </Text>
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            End: {new Date(coursework.end_time).toLocaleString()}
          </Text>
          <Text style={[styles.detailText, isDark && styles.textLightDark]}>
            Submission: {coursework.submission_method}
          </Text>
        </View>

        {/* Action buttons only show for classroom view when expanded */}
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
  nonInteractiveCard: {
    // Subtle visual indication for non-interactive cards
    opacity: 0.95,
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 24,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
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
    marginTop: 16,
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
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