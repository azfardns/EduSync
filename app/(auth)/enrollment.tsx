import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollment } from '@/hooks/useEnrollment';
import { ChevronDown, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function EnrollmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    faculties,
    programs,
    courses,
    isLoading,
    error,
    fetchFaculties,
    fetchProgramsByFaculty,
    fetchCoursesByProgram,
    submitEnrollment,
  } = useEnrollment();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fullName, setFullName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [yearOfStudy, setYearOfStudy] = useState<string>('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      fetchProgramsByFaculty(selectedFaculty);
      setSelectedProgram(null);
      setSelectedCourses([]);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedProgram && yearOfStudy) {
      fetchCoursesByProgram(selectedProgram, parseInt(yearOfStudy));
    }
  }, [selectedProgram, yearOfStudy]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!selectedFaculty) {
      errors.faculty = 'Faculty selection is required';
    }
    if (!selectedProgram) {
      errors.program = 'Program selection is required';
    }
    if (!yearOfStudy) {
      errors.yearOfStudy = 'Year of study is required';
    } else {
      const year = parseInt(yearOfStudy);
      if (isNaN(year) || year < 1 || year > 4) {
        errors.yearOfStudy = 'Year must be between 1 and 4';
      }
    }
    if (selectedCourses.length === 0) {
      errors.courses = 'Please select at least one course';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await submitEnrollment({
        fullName: fullName.trim(),
        facultyId: selectedFaculty!,
        programId: selectedProgram!,
        yearOfStudy: parseInt(yearOfStudy),
        courseIds: selectedCourses,
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.loadingText, isDark && styles.textDark]}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>Complete Your Profile</Text>
          <Text style={[styles.subtitle, isDark && styles.textLightDark]}>
            Please provide your academic information to complete enrollment
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Full Name *</Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                formErrors.fullName && styles.inputError,
              ]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
            />
            {formErrors.fullName && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{formErrors.fullName}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Faculty *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                formErrors.faculty && styles.inputError,
              ]}
              onPress={() => setShowFacultyDropdown(!showFacultyDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  isDark && styles.textDark,
                  !selectedFaculty && styles.placeholder,
                ]}
              >
                {selectedFaculty
                  ? faculties.find((f) => f.id === selectedFaculty)?.name
                  : 'Select your faculty'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            {showFacultyDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {faculties.map((faculty) => (
                  <TouchableOpacity
                    key={faculty.id}
                    style={[
                      styles.dropdownItem,
                      isDark && styles.dropdownItemDark,
                      selectedFaculty === faculty.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedFaculty(faculty.id);
                      setShowFacultyDropdown(false);
                      setFormErrors((prev) => ({ ...prev, faculty: '' }));
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isDark && styles.textDark,
                        selectedFaculty === faculty.id && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {faculty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {formErrors.faculty && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{formErrors.faculty}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Program *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                formErrors.program && styles.inputError,
                !selectedFaculty && styles.dropdownDisabled,
              ]}
              onPress={() => selectedFaculty && setShowProgramDropdown(!showProgramDropdown)}
              disabled={!selectedFaculty}
            >
              <Text
                style={[
                  styles.dropdownText,
                  isDark && styles.textDark,
                  !selectedProgram && styles.placeholder,
                ]}
              >
                {selectedProgram
                  ? programs.find((p) => p.id === selectedProgram)?.name
                  : selectedFaculty
                  ? 'Select your program'
                  : 'Select a faculty first'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            {showProgramDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {programs.map((program) => (
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
                      setFormErrors((prev) => ({ ...prev, program: '' }));
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
              </View>
            )}
            {formErrors.program && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{formErrors.program}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Year of Study *</Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                formErrors.yearOfStudy && styles.inputError,
              ]}
              value={yearOfStudy}
              onChangeText={(text) => {
                setYearOfStudy(text);
                if (formErrors.yearOfStudy) {
                  setFormErrors((prev) => ({ ...prev, yearOfStudy: '' }));
                }
              }}
              placeholder="Enter year (1-4)"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="number-pad"
              maxLength={1}
            />
            {formErrors.yearOfStudy && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{formErrors.yearOfStudy}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Course Selection *</Text>
            <Text style={[styles.warning, isDark && styles.warningDark]}>
              Course selections are final and cannot be modified after submission
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
                    if (formErrors.courses) {
                      setFormErrors((prev) => ({ ...prev, courses: '' }));
                    }
                  }}
                >
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
                </TouchableOpacity>
              ))}
            </View>
            {formErrors.courses && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{formErrors.courses}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isDark && styles.submitButtonDark]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Complete Enrollment</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: 32,
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
    lineHeight: 24,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#EEEEEE',
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
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownItemTextSelected: {
    color: '#4361EE',
    fontWeight: '600',
  },
  warning: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  warningDark: {
    backgroundColor: '#483C14',
    color: '#FFB74D',
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
  },
  courseItemDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  courseItemSelected: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
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
  submitButton: {
    backgroundColor: '#4361EE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  submitButtonDark: {
    backgroundColor: '#4361EE',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
});