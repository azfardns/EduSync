import { useState } from 'react';
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
import { useAcademicData } from '@/hooks/useAcademicData';
import { ChevronDown, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { supabase } from '@/hooks/useSupabase';

export default function EnrollmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { faculties, programs, getProgramsByFaculty, isLoading: isAcademicDataLoading } = useAcademicData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fullName, setFullName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availablePrograms = selectedFaculty ? getProgramsByFaculty(selectedFaculty) : [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!selectedFaculty) newErrors.faculty = 'Faculty is required';
    if (!selectedProgram) newErrors.program = 'Program is required';
    if (!yearOfStudy) {
      newErrors.yearOfStudy = 'Year of study is required';
    } else {
      const year = parseInt(yearOfStudy);
      if (isNaN(year) || year < 1 || year > 4) {
        newErrors.yearOfStudy = 'Year of study must be between 1 and 4';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          faculty_id: selectedFaculty,
          program_id: selectedProgram,
          year_of_study: parseInt(yearOfStudy),
          enrollment_completed: true,
          enrollment_locked: true,
        })
        .eq('id', user?.id);

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (isAcademicDataLoading) {
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
                errors.fullName && styles.inputError,
              ]}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: '' }));
                }
              }}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
            />
            {errors.fullName && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.fullName}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Faculty *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                errors.faculty && styles.inputError,
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
                      setSelectedProgram(null);
                      setShowFacultyDropdown(false);
                      setErrors((prev) => ({ ...prev, faculty: '' }));
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
            {errors.faculty && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.faculty}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Program *</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                errors.program && styles.inputError,
                (!selectedFaculty || availablePrograms.length === 0) && styles.dropdownDisabled,
              ]}
              onPress={() => {
                if (selectedFaculty && availablePrograms.length > 0) {
                  setShowProgramDropdown(!showProgramDropdown);
                }
              }}
              disabled={!selectedFaculty || availablePrograms.length === 0}
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
                  : !selectedFaculty
                  ? 'Select a faculty first'
                  : availablePrograms.length === 0
                  ? 'No programs available'
                  : 'Select your program'}
              </Text>
              <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            {showProgramDropdown && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {availablePrograms.map((program) => (
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
              </View>
            )}
            {errors.program && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.program}</Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, isDark && styles.textDark]}>Year of Study *</Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                errors.yearOfStudy && styles.inputError,
              ]}
              value={yearOfStudy}
              onChangeText={(text) => {
                setYearOfStudy(text);
                if (errors.yearOfStudy) {
                  setErrors((prev) => ({ ...prev, yearOfStudy: '' }));
                }
              }}
              placeholder="Enter your year of study (1-4)"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              keyboardType="number-pad"
              maxLength={1}
            />
            {errors.yearOfStudy && (
              <View style={styles.errorContainer}>
                <AlertTriangle size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.yearOfStudy}</Text>
              </View>
            )}
          </View>

          <View style={styles.warning}>
            <AlertTriangle size={20} color={isDark ? '#FFB74D' : '#856404'} />
            <Text style={[styles.warningText, isDark && styles.warningTextDark]}>
              Your enrollment information cannot be changed after submission
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isDark && styles.submitButtonDark]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Complete Enrollment</Text>
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
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
  warningTextDark: {
    color: '#FFB74D',
  },
  submitButton: {
    backgroundColor: '#4361EE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
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