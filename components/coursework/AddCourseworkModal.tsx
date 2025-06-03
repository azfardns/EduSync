import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDown, X, AlertCircle as AlertCircle } from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  code: string;
}

interface AddCourseworkModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (coursework: any) => void;
  courses: Course[];
}

function AddCourseworkModal({ visible, onClose, onSubmit, courses }: AddCourseworkModalProps) {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [type, setType] = useState('Quiz');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [timeError, setTimeError] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [showCourseList, setShowCourseList] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const validateForm = () => {
    let isValid = true;
    
    setTitleError(null);
    setCourseError(null);
    setTimeError(null);

    if (!title.trim()) {
      setTitleError('Please enter a title for the coursework');
      isValid = false;
    }

    if (!selectedCourse) {
      setCourseError('Please select a course');
      isValid = false;
    }

    if (endTime <= startTime) {
      setTimeError('End time must be after start time');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const courseworkData = {
      title: title.trim(),
      course_id: selectedCourse!.id,
      type,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      description: description.trim(),
      subject_area: 'General',
      domain: 'Cognitive',
      submission_method: 'online',
      submission_format: 'text',
      submission_length: 'standard',
      clo_ids: [],
    };

    onSubmit(courseworkData);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setTitleError(null);
    setSelectedCourse(null);
    setCourseError(null);
    setType('Quiz');
    setStartTime(new Date());
    setEndTime(new Date());
    setTimeError(null);
    setDescription('');
    setShowCourseList(false);
    // Close all datetime pickers
    setShowStartDatePicker(false);
    setShowStartTimePicker(false);
    setShowEndDatePicker(false);
    setShowEndTimePicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderWebDateTimeInput = (
    value: Date,
    onChange: (date: Date) => void,
    type: 'date' | 'time'
  ) => {
    if (Platform.OS !== 'web') return null;
    
    return (
      <input
        type={type}
        value={
          type === 'date'
            ? value.toISOString().split('T')[0]
            : value.toTimeString().split(' ')[0].substring(0, 5)
        }
        onChange={(e) => {
          const newDate = new Date(value);
          if (type === 'date') {
            const [year, month, day] = e.target.value.split('-');
            newDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            const [hours, minutes] = e.target.value.split(':');
            newDate.setHours(parseInt(hours), parseInt(minutes));
          }
          onChange(newDate);
        }}
        style={{
          flex: 1,
          padding: 12,
          borderRadius: 8,
          border: `1px solid ${isDark ? '#3A3A3A' : '#EEEEEE'}`,
          backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
          color: isDark ? '#FFFFFF' : '#333333',
          fontSize: 14,
          outline: 'none',
        }}
      />
    );
  };

  // Course List Overlay Component (rendered outside ScrollView)
  const CourseListOverlay = () => {
    if (!showCourseList) return null;

    return (
      <Modal
        visible={showCourseList}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCourseList(false)}
      >
        <TouchableOpacity
          style={styles.overlayBackground}
          activeOpacity={1}
          onPress={() => setShowCourseList(false)}
        >
          <View style={[styles.courseListModal, isDark && styles.courseListModalDark]}>
            <Text style={[styles.courseListTitle, isDark && styles.textDark]}>
              Select Course
            </Text>
            <ScrollView style={styles.courseListScroll} showsVerticalScrollIndicator={false}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseItem,
                    selectedCourse?.id === course.id && styles.selectedCourseItem,
                    isDark && styles.courseItemDark,
                    selectedCourse?.id === course.id && isDark && styles.selectedCourseItemDark,
                  ]}
                  onPress={() => {
                    setSelectedCourse(course);
                    setShowCourseList(false);
                    setCourseError(null);
                  }}
                >
                  <Text
                    style={[
                      styles.courseItemTitle,
                      selectedCourse?.id === course.id && styles.selectedCourseItemText,
                      isDark && styles.textDark,
                    ]}
                  >
                    {course.title}
                  </Text>
                  <Text
                    style={[
                      styles.courseItemCode,
                      isDark && styles.textLightDark,
                    ]}
                  >
                    {course.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={[styles.modalOverlay, isDark && styles.modalOverlayDark]}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={[styles.modalHeader, isDark && { borderBottomColor: '#3A3A3A' }]}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>
                Add New Coursework
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Basic Information</Text>
                
                <View style={styles.formGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Title</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isDark && styles.inputDark,
                      titleError && styles.inputError,
                    ]}
                    value={title}
                    onChangeText={(text) => {
                      setTitle(text);
                      setTitleError(null);
                    }}
                    placeholder="Enter coursework title"
                    placeholderTextColor={isDark ? '#888888' : '#999999'}
                  />
                  {titleError && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={16} color="#FF6B6B" />
                      <Text style={styles.errorText}>{titleError}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Course</Text>
                  <TouchableOpacity
                    style={[
                      styles.courseSelector,
                      isDark && styles.courseSelectorDark,
                      courseError && styles.inputError,
                    ]}
                    onPress={() => setShowCourseList(true)}
                  >
                    <Text 
                      style={[
                        styles.courseSelectorText,
                        isDark && styles.textDark,
                        selectedCourse && styles.courseSelectorTextSelected
                      ]}
                    >
                      {selectedCourse ? selectedCourse.title : 'Select Course'}
                    </Text>
                    <ChevronDown size={20} color={isDark ? '#BBBBBB' : '#666666'} />
                  </TouchableOpacity>
                  {courseError && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={16} color="#FF6B6B" />
                      <Text style={styles.errorText}>{courseError}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Assessment Details</Text>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Type</Text>
                  <View style={styles.typeOptions}>
                    {['Quiz', 'Test', 'Exam', 'Project'].map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.typeOption,
                          type === t && styles.typeOptionSelected,
                          isDark && styles.typeOptionDark,
                          type === t && isDark && styles.typeOptionSelectedDark,
                        ]}
                        onPress={() => setType(t)}
                      >
                        <Text
                          style={[
                            styles.typeOptionText,
                            type === t && styles.typeOptionTextSelected,
                            isDark && styles.textDark,
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>Schedule</Text>
                  
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleColumn}>
                      <Text style={[styles.scheduleLabel, isDark && styles.textLightDark]}>
                        Start Date & Time
                      </Text>
                      {Platform.OS === 'web' ? (
                        <View style={styles.webDateTimeRow}>
                          {renderWebDateTimeInput(startTime, setStartTime, 'date')}
                          {renderWebDateTimeInput(startTime, setStartTime, 'time')}
                        </View>
                      ) : (
                        <View style={styles.nativeDateTimeContainer}>
                          <TouchableOpacity
                            style={[styles.dateTimeButton, isDark && styles.dateTimeButtonDark]}
                            onPress={() => setShowStartDatePicker(true)}
                          >
                            <Text style={[styles.dateTimeText, isDark && styles.textDark]}>
                              {formatDate(startTime)}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.dateTimeButton, isDark && styles.dateTimeButtonDark]}
                            onPress={() => setShowStartTimePicker(true)}
                          >
                            <Text style={[styles.dateTimeText, isDark && styles.textDark]}>
                              {formatTime(startTime)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View style={styles.scheduleColumn}>
                      <Text style={[styles.scheduleLabel, isDark && styles.textLightDark]}>
                        End Date & Time
                      </Text>
                      {Platform.OS === 'web' ? (
                        <View style={styles.webDateTimeRow}>
                          {renderWebDateTimeInput(endTime, setEndTime, 'date')}
                          {renderWebDateTimeInput(endTime, setEndTime, 'time')}
                        </View>
                      ) : (
                        <View style={styles.nativeDateTimeContainer}>
                          <TouchableOpacity
                            style={[styles.dateTimeButton, isDark && styles.dateTimeButtonDark]}
                            onPress={() => setShowEndDatePicker(true)}
                          >
                            <Text style={[styles.dateTimeText, isDark && styles.textDark]}>
                              {formatDate(endTime)}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.dateTimeButton, isDark && styles.dateTimeButtonDark]}
                            onPress={() => setShowEndTimePicker(true)}
                          >
                            <Text style={[styles.dateTimeText, isDark && styles.textDark]}>
                              {formatTime(endTime)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>

                  {timeError && (
                    <View style={styles.errorContainer}>
                      <AlertCircle size={16} color="#FF6B6B" />
                      <Text style={styles.errorText}>{timeError}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, isDark && styles.textDark]}>
                    Description (optional)
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea, isDark && styles.inputDark]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter coursework description"
                    placeholderTextColor={isDark ? '#888888' : '#999999'}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={[styles.buttonContainer, isDark && { borderTopColor: '#3A3A3A' }]}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, isDark && styles.cancelButtonDark]} 
                onPress={handleClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  (!title || !selectedCourse) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!title || !selectedCourse}
              >
                <Text style={styles.buttonText}>Add Coursework</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Native DateTime Pickers */}
          {Platform.OS !== 'web' && (
            <>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="date"
                  is24Hour={true}
                  onChange={(event, date) => {
                    setShowStartDatePicker(false);
                    if (date) {
                      setStartTime(date);
                      setTimeError(null);
                    }
                  }}
                />
              )}
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  onChange={(event, date) => {
                    setShowStartTimePicker(false);
                    if (date) {
                      setStartTime(date);
                      setTimeError(null);
                    }
                  }}
                />
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="date"
                  is24Hour={true}
                  onChange={(event, date) => {
                    setShowEndDatePicker(false);
                    if (date) {
                      setEndTime(date);
                      setTimeError(null);
                    }
                  }}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  is24Hour={true}
                  onChange={(event, date) => {
                    setShowEndTimePicker(false);
                    if (date) {
                      setEndTime(date);
                      setTimeError(null);
                    }
                  }}
                />
              )}
            </>
          )}
        </View>
      </Modal>

      {/* Course Selection Overlay */}
      <CourseListOverlay />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    color: '#333333',
    fontSize: 16,
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
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  courseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  courseSelectorDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  courseSelectorText: {
    fontSize: 16,
    color: '#999999',
  },
  courseSelectorTextSelected: {
    color: '#333333',
    fontWeight: '500',
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  typeOption: {
    flex: 1,
    minWidth: '22%',
    margin: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  typeOptionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  typeOptionSelected: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  typeOptionSelectedDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#4361EE',
    fontWeight: '600',
  },
  scheduleRow: {
    flexDirection: 'column',
    gap: 16,
  },
  scheduleColumn: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  webDateTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  nativeDateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  dateTimeButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cancelButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  cancelButtonText: {
    color: '#666666',
  },
  cancelButtonTextDark: {
    color: '#BBBBBB',
  },
  submitButton: {
    backgroundColor: '#4361EE',
  },
  submitButtonDisabled: {
    backgroundColor: '#A1B1F8',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#BBBBBB',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B6B',
  },
  // Course List Overlay Styles
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  courseListModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  courseListModalDark: {
    backgroundColor: '#1A1A1A',
  },
  courseListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  courseListScroll: {
    maxHeight: 300,
    padding: 16,
  },
  courseItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  courseItemDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  selectedCourseItem: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  selectedCourseItemDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  courseItemTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedCourseItemText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  courseItemCode: {
    fontSize: 14,
    color: '#666666',
  },
});

export default AddCourseworkModal;