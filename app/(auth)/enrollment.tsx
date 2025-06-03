import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/hooks/useSupabase';

export default function EnrollmentScreen() {
  const { courseId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user?.id,
          course_id: courseId,
        });

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Check size={48} color="#4CAF50" />
        <Text style={styles.title}>Confirm Enrollment</Text>
        <Text style={styles.description}>
          You're about to enroll in this course. Click confirm to proceed.
        </Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.button} onPress={handleEnroll}>
            Confirm Enrollment
          </Text>
          <Text style={styles.cancelButton} onPress={() => router.back()}>
            Cancel
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    color: '#666',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
  },
});