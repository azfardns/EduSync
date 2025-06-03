import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAcademicData } from '@/hooks/useAcademicData';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/hooks/useSupabase';
import { ChevronDown, TriangleAlert as AlertTriangle, Lock } from 'lucide-react-native';

export default function EnrollmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { academicPrograms, departments, isLoading: isAcademicDataLoading } = useAcademicData();
  const { courses } = useCourses();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fullName, setFullName] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [yearLevel, setYearLevel] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Disable back button to prevent navigation away
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Enrollment Required',
        'You must complete your enrollment before accessing the app.',
        [{ text: 'OK' }]
      );
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Prevent navigation away from this screen
  useEffect(() => {
    const preventNavigation = () => {
      if (!user?.enrollment_completed) {
        router.replace('/(auth)/enrollment');
      }
    };

    // Check on mount and when user data changes
    preventNavigation();
  }, [user, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!selectedProgram) {
      newErrors.program = 'Academic program is required';
    } else {
      // Validate program exists in database
      const programExists = academicPrograms.find(p => p.id === selectedProgram);
      if (!programExists) {
        newErrors.program = 'Selected program is invalid';
      }
    }

    if (!selectedDepartment) {
      newErrors.department = 'Department is required';
    } else {
      // Validate department exists in database
      const departmentExists = departments.find(d => d.id === selectedDepartment);
      if (!departmentExists) {
        newErrors.department = 'Selected department is invalid';
      }
    }

    if (!yearLevel) {
      newErrors.yearLevel = 'Year level is required';
    } else {
      const year = parseInt(yearLevel);
      if (isNaN(year) || year < 1 || year > 6) {
        newErrors.yearLevel = 'Year level must be between 1 and 6';
      }
    }

    if (selectedCourses.length === 0) {
      newErrors.courses = 'Please select at least one course';
    } else {
      // Validate all selected courses exist in database
      const invalidCourses = selectedCourses.filter(
        courseId => !courses.find(c => c.id === courseId)
      );
      if (invalidCourses.length > 0) {
        newErrors.courses = 'Some selected courses are invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please correct the errors in the form before submitting.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Update user profile with enrollment data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: fullName.trim(),
          academic_program_id: selectedProgram,
          department_id: selectedDepartment,
          year_level: parseInt(yearLevel),
          enrollment_completed: true,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Create course enrollments
      const enrollmentPromises = selectedCourses.map((courseId) =>
        supabase.from('enrollments').insert({
          student_id: user?.id,
          course_id: courseId,
        })
      );

      const enrollmentResults = await Promise.all(enrollmentPromises);
      
      // Check for enrollment errors
      const enrollmentError = enrollmentResults.find(result => result.error);
      if (enrollmentError?.error) throw enrollmentError.error;

      Alert.alert(
        'Enrollment Complete!',
        'Your enrollment has been successfully submitted. Welcome to the app!',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Enrollment error:', error);
      Alert.alert(
        'Enrollment Failed',
        error.message || 'An error occurred during enrollment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAcademicDataLoading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.textDark]}>
            Loading enrollment form...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.lockIconContainer}>
            <Lock size={32} color="#FF6B6B" />
          </View>
          <Text style={[styles.title, isDark && styles.textDark]}>
            Complete Your Enrollment
          </Text>
          <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
            This is a one-time enrollment form. You must complete this before accessing the app.
          </Text>
        </View>

        {/* Immutability Warning */}
        <View style={[styles.warningCard, isDark && styles.warningCardDark]}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={24} color="#FF6B6B" />
            <Text style={styles.warningTitle}>Important Notice</Text>
          </View>
          <Text style={[styles.warningText, isDark && styles.warningTextDark]}>
            Your enrollment selections are permanent and cannot be modified later. 
            Please review all information carefully before submitting.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Full Name Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Full Name *</Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                errors.fullName && styles.inputError,
              ]}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: '' }));
                }
              }}
              placeholder="Enter your complete full name"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              autoCapitalize="words"
              maxLength={100}
            />
            {errors.fullName && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.fullName}</Text>
              </View>
            )}
          </View>

          {/* Academic Program Dropdown */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Academic Program *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                errors.program && styles.inputError,
              ]}
              onPress={() => setShowProgramDropdown(!showProgramDropdown)}
              disabled={isSubmitting}
            >
              <Text
                style={[
                  styles.dropdownText,
                  isDark && styles.textDark,
                  !selectedProgram && styles.placeholder,
                ]}
              >
                {selectedProgram
                  ? academicPrograms.find((p) => p.id === selectedProgram)?.name
                  : 'Select your academic program'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            {showProgramDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
                  {academicPrograms.map((program) => (
                    <TouchableOpacity
                      key={program.id}
                      style={[
                        styles.dropdownItem,
                        isDark && styles.dropdownItemDark,
                        selectedProgram === program.id && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedProgram(program.id);
                        setShowProgramDropdown(false);
                        setErrors((prev) => ({ ...prev, program: '' }));
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isDark && styles.textDark,
                          selectedProgram === program.id && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {program.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {errors.program && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.program}</Text>
              </View>
            )}
          </View>

          {/* Department Dropdown */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Department *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                errors.department && styles.inputError,
              ]}
              onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
              disabled={isSubmitting}
            >
              <Text
                style={[
                  styles.dropdownText,
                  isDark && styles.textDark,
                  !selectedDepartment && styles.placeholder,
                ]}
              >
                {selectedDepartment
                  ? departments.find((d) => d.id === selectedDepartment)?.name
                  : 'Select your department'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            {showDepartmentDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
                  {departments.map((department) => (
                    <TouchableOpacity
                      key={department.id}
                      style={[
                        styles.dropdownItem,
                        isDark && styles.dropdownItemDark,
                        selectedDepartment === department.id && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedDepartment(department.id);
                        setShowDepartmentDropdown(false);
                        setErrors((prev) => ({ ...prev, department: '' }));
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isDark && styles.textDark,
                          selectedDepartment === department.id && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {department.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {errors.department && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.department}</Text>
              </View>
            )}
          </View>

          {/* Year Level Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Year of Study *</Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                errors.yearLevel && styles.inputError,
              ]}
              value={yearLevel}
              onChangeText={(text) => {
                // Only allow numbers 1-6
                if (/^[1-6]?$/.test(text)) {
                  setYearLevel(text);
                  if (errors.yearLevel) {
                    setErrors((prev) => ({ ...prev, yearLevel: '' }));
                  }
                }
              }}
              placeholder="Enter your year level (1-6)"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="number-pad"
              maxLength={1}
            />
            {errors.yearLevel && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.yearLevel}</Text>
              </View>
            )}
          </View>

          {/* Course Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Course Selection *</Text>
            <Text style={[styles.helperText, isDark && styles.textLightDark]}>
              Select all courses you want to enroll in. You can select multiple courses.
            </Text>
            <View style={styles.courseList}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseItem,
                    isDark && styles.courseItemDark,
                    selectedCourses.includes(course.id) && styles.courseItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCourses((prev) =>
                      prev.includes(course.id)
                        ? prev.filter((id) => id !== course.id)
                        : [...prev, course.id]
                    );
                    if (errors.courses) {
                      setErrors((prev) => ({ ...prev, courses: '' }));
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <View style={styles.courseInfo}>
                    <Text
                      style={[
                        styles.courseTitle,
                        isDark && styles.textDark,
                        selectedCourses.includes(course.id) && styles.courseTextSelected,
                      ]}
                    >
                      {course.title}
                    </Text>
                    <Text
                      style={[
                        styles.courseCode,
                        isDark && styles.textLightDark,
                        selectedCourses.includes(course.id) && styles.courseTextSelected,
                      ]}
                    >
                      {course.code}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isDark && styles.checkboxDark,
                      selectedCourses.includes(course.id) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedCourses.includes(course.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {errors.courses && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.courses}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isDark && styles.submitButtonDark,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Complete Enrollment'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.finalWarning, isDark && styles.finalWarningDark]}>
          By clicking "Complete Enrollment", you confirm that all information is correct and 
          understand that these selections cannot be changed.
        </Text>
      </ScrollView>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIconContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFE5E5',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
  warningCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFE5E5',
  },
  warningCardDark: {
    backgroundColor: '#2A1A1A',
    borderColor: '#3A2A2A',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#CC5555',
    lineHeight: 20,
  },
  warningTextDark: {
    color: '#FF8888',
  },
  form: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    color: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    marginLeft: 8,
    color: '#FF6B6B',
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dropdownDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  placeholder: {
    color: '#999999',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    maxHeight: 200,
  },
  dropdownListDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemDark: {
    borderBottomColor: '#3A3A3A',
  },
  dropdownItemSelected: {
    backgroundColor: '#E7ECFF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownItemTextSelected: {
    color: '#4361EE',
    fontWeight: '600',
  },
  courseList: {
    gap: 12,
  },
  courseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseItemDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  courseItemSelected: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    color: '#666666',
  },
  courseTextSelected: {
    color: '#4361EE',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDark: {
    borderColor: '#555555',
    backgroundColor: '#2A2A2A',
  },
  checkboxSelected: {
    backgroundColor: '#4361EE',
    borderColor: '#4361EE',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4361EE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDark: {
    backgroundColor: '#4361EE',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finalWarning: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 18,
  },
  finalWarningDark: {
    color: '#777777',
  },
});