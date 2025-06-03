import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, AlertTriangle, Check, X } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/hooks/useSupabase';

type Faculty = {
  id: string;
  name: string;
};

type Program = {
  id: string;
  name: string;
  faculty_id: string;
};

type Course = {
  id: string;
  code: string;
  title: string;
  program_id: string;
  year: number;
  is_required: boolean;
};

export default function EnrollmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkEnrollmentStatus();
    fetchFaculties();
  }, []);

  const checkEnrollmentStatus = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('enrollment_completed')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profile?.enrollment_completed) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const { data, error } = await supabase
        .from('faculties')
        .select('*')
        .order('name');

      if (error) throw error;
      setFaculties(data || []);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setError('Failed to load faculties. Please try again.');
    }
  };

  const fetchPrograms = async (facultyId: string) => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to load programs. Please try again.');
    }
  };

  const fetchCourses = async (programId: string, year: number) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('program_id', programId)
        .eq('year', year)
        .order('is_required', { ascending: false })
        .order('code');

      if (error) throw error;
      setCourses(data || []);

      // Auto-select required courses
      const requiredCourseIds = new Set(
        data
          .filter(course => course.is_required)
          .map(course => course.id)
      );
      setSelectedCourses(requiredCourseIds);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    }
  };

  const handleFacultySelect = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setSelectedProgram(null);
    setSelectedYear(null);
    setCourses([]);
    setSelectedCourses(new Set());
    setShowFacultyDropdown(false);
    fetchPrograms(faculty.id);
  };

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setSelectedYear(null);
    setCourses([]);
    setSelectedCourses(new Set());
    setShowProgramDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearDropdown(false);
    if (selectedProgram) {
      fetchCourses(selectedProgram.id, year);
    }
  };

  const toggleCourse = (courseId: string, isRequired: boolean) => {
    if (isRequired) return; // Cannot toggle required courses

    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!selectedProgram || !selectedYear) {
      setError('Please complete all required fields.');
      return;
    }

    const requiredCourses = courses.filter(c => c.is_required);
    const selectedCoursesList = Array.from(selectedCourses);
    
    if (selectedCoursesList.length < requiredCourses.length) {
      setError('You must select all required courses.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Update profile with enrollment information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          faculty_id: selectedFaculty?.id,
          program_id: selectedProgram.id,
          year_of_study: selectedYear,
          enrollment_completed: true,
          enrollment_locked: true,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Create course enrollments
      const enrollments = Array.from(selectedCourses).map(courseId => ({
        student_id: user?.id,
        course_id: courseId,
      }));

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert(enrollments);

      if (enrollmentError) throw enrollmentError;

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error saving enrollment:', error);
      setError('Failed to save enrollment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDark ? '#4361EE' : '#4361EE'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>Complete Your Enrollment</Text>
          <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
            Please provide your academic information to complete the enrollment process
          </Text>
        </View>

        <View style={styles.form}>
          {/* Faculty Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Faculty *</Text>
            <TouchableOpacity
              style={[styles.dropdown, isDark && styles.dropdownDark]}
              onPress={() => setShowFacultyDropdown(!showFacultyDropdown)}
            >
              <Text style={[
                styles.dropdownText,
                !selectedFaculty && styles.placeholder,
                isDark && !selectedFaculty && styles.placeholderDark,
                isDark && selectedFaculty && styles.textDark
              ]}>
                {selectedFaculty?.name || 'Select Faculty'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>

            {showFacultyDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {faculties.map(faculty => (
                  <TouchableOpacity
                    key={faculty.id}
                    style={[
                      styles.dropdownItem,
                      selectedFaculty?.id === faculty.id && styles.dropdownItemSelected,
                      isDark && styles.dropdownItemDark,
                      selectedFaculty?.id === faculty.id && isDark && styles.dropdownItemSelectedDark
                    ]}
                    onPress={() => handleFacultySelect(faculty)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedFaculty?.id === faculty.id && styles.dropdownItemTextSelected,
                      isDark && styles.textDark
                    ]}>
                      {faculty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Program Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Program *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                !selectedFaculty && styles.dropdownDisabled,
                isDark && styles.dropdownDark
              ]}
              onPress={() => selectedFaculty && setShowProgramDropdown(!showProgramDropdown)}
              disabled={!selectedFaculty}
            >
              <Text style={[
                styles.dropdownText,
                !selectedProgram && styles.placeholder,
                isDark && !selectedProgram && styles.placeholderDark,
                isDark && selectedProgram && styles.textDark
              ]}>
                {selectedProgram?.name || 'Select Program'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>

            {showProgramDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {programs.map(program => (
                  <TouchableOpacity
                    key={program.id}
                    style={[
                      styles.dropdownItem,
                      selectedProgram?.id === program.id && styles.dropdownItemSelected,
                      isDark && styles.dropdownItemDark,
                      selectedProgram?.id === program.id && isDark && styles.dropdownItemSelectedDark
                    ]}
                    onPress={() => handleProgramSelect(program)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedProgram?.id === program.id && styles.dropdownItemTextSelected,
                      isDark && styles.textDark
                    ]}>
                      {program.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Year Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Year of Study *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                !selectedProgram && styles.dropdownDisabled,
                isDark && styles.dropdownDark
              ]}
              onPress={() => selectedProgram && setShowYearDropdown(!showYearDropdown)}
              disabled={!selectedProgram}
            >
              <Text style={[
                styles.dropdownText,
                !selectedYear && styles.placeholder,
                isDark && !selectedYear && styles.placeholderDark,
                isDark && selectedYear && styles.textDark
              ]}>
                {selectedYear ? `Year ${selectedYear}` : 'Select Year'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>

            {showYearDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {[1, 2, 3, 4].map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.dropdownItem,
                      selectedYear === year && styles.dropdownItemSelected,
                      isDark && styles.dropdownItemDark,
                      selectedYear === year && isDark && styles.dropdownItemSelectedDark
                    ]}
                    onPress={() => handleYearSelect(year)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedYear === year && styles.dropdownItemTextSelected,
                      isDark && styles.textDark
                    ]}>
                      Year {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Course Selection */}
          {courses.length > 0 && (
            <View style={styles.formGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Course Selection</Text>
              <Text style={[styles.courseInfo, isDark && styles.textLightDark]}>
                Required courses are automatically selected and cannot be changed
              </Text>

              {courses.map(course => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseItem,
                    selectedCourses.has(course.id) && styles.courseItemSelected,
                    isDark && styles.courseItemDark,
                    selectedCourses.has(course.id) && isDark && styles.courseItemSelectedDark
                  ]}
                  onPress={() => toggleCourse(course.id, course.is_required)}
                  disabled={course.is_required}
                >
                  <View style={styles.courseInfo}>
                    <Text style={[
                      styles.courseCode,
                      selectedCourses.has(course.id) && styles.courseTextSelected,
                      isDark && styles.textDark
                    ]}>
                      {course.code}
                    </Text>
                    <Text style={[
                      styles.courseTitle,
                      selectedCourses.has(course.id) && styles.courseTextSelected,
                      isDark && styles.textLightDark
                    ]}>
                      {course.title}
                    </Text>
                  </View>
                  <View style={styles.courseStatus}>
                    {course.is_required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredBadgeText}>Required</Text>
                      </View>
                    )}
                    {selectedCourses.has(course.id) ? (
                      <Check size={20} color={isDark ? '#4361EE' : '#4361EE'} />
                    ) : (
                      <View style={[styles.checkbox, isDark && styles.checkboxDark]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <AlertTriangle size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.warningContainer}>
            <AlertTriangle size={20} color={isDark ? '#FF9F1C' : '#FF6B6B'} />
            <Text style={[styles.warningText, isDark && styles.warningTextDark]}>
              Enrollment choices are final and cannot be changed later
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedFaculty || !selectedProgram || !selectedYear) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedFaculty || !selectedProgram || !selectedYear || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Enrollment</Text>
            )}
          </TouchableOpacity>
        </View>
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
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dropdownDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholder: {
    color: '#999999',
  },
  placeholderDark: {
    color: '#666666',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    maxHeight: 200,
  },
  dropdownListDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
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
  dropdownItemSelectedDark: {
    backgroundColor: '#344181',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownItemTextSelected: {
    color: '#4361EE',
    fontWeight: '600',
  },
  courseInfo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
  },
  courseItemDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  courseItemSelected: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  courseItemSelectedDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 14,
    color: '#666666',
  },
  courseTextSelected: {
    color: '#4361EE',
  },
  courseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requiredBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredBadgeText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  checkboxDark: {
    borderColor: '#666666',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B6B',
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B6B',
    flex: 1,
  },
  warningTextDark: {
    color: '#FF9F1C',
  },
  submitButton: {
    backgroundColor: '#4361EE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A1B1F8',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
});