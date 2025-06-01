import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Switch
} from 'react-native';
import { X, Calendar, Clock } from 'lucide-react-native';

type Course = {
  id: string;
  title: string;
};

type NewCourseworkModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDate: Date;
  courses: Course[];
  isDark?: boolean;
};

const NewCourseworkModal: React.FC<NewCourseworkModalProps> = ({
  visible,
  onClose,
  onSubmit,
  selectedDate,
  courses,
  isDark = false
}) => {
  const [title, setTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedType, setSelectedType] = useState<string>('Quiz');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [isTimer, setIsTimer] = useState(true);
  const [isAutoSubmit, setIsAutoSubmit] = useState(true);
  
  const resetForm = () => {
    setTitle('');
    setSelectedCourse(null);
    setSelectedType('Quiz');
    setStartTime('09:00');
    setDuration('60');
    setRoom('');
    setNotes('');
    setIsTimer(true);
    setIsAutoSubmit(true);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSubmit = () => {
    if (!title || !selectedCourse) {
      return;
    }
    
    const assessmentData = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      type: selectedType,
      date: selectedDate.toISOString(),
      time: startTime,
      duration: `${duration} min`,
      room,
      notes,
      isTimer,
      isAutoSubmit,
    };
    
    onSubmit(assessmentData);
    resetForm();
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              Add New Coursework
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleClose}
            >
              <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Title</Text>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Coursework title"
                placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Course</Text>
              <View style={styles.courseList}>
                {courses.map(course => (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.courseItem,
                      selectedCourse?.id === course.id && styles.selectedCourseItem,
                      isDark && styles.courseItemDark,
                      selectedCourse?.id === course.id && isDark && styles.selectedCourseItemDark
                    ]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <Text 
                      style={[
                        styles.courseItemText,
                        selectedCourse?.id === course.id && styles.selectedCourseItemText,
                        isDark && styles.textDark
                      ]}
                    >
                      {course.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Type</Text>
              <View style={styles.typeList}>
                {['Quiz', 'Exam', 'Lab', 'Lecture', 'Assignment'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeItem,
                      selectedType === type && styles.selectedTypeItem,
                      isDark && styles.typeItemDark,
                      selectedType === type && isDark && styles.selectedTypeItemDark
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text 
                      style={[
                        styles.typeItemText,
                        selectedType === type && styles.selectedTypeItemText,
                        isDark && styles.textDark
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, isDark && styles.textDark]}>Date</Text>
                <View style={[styles.dateInput, isDark && styles.dateInputDark]}>
                  <Calendar size={16} color={isDark ? '#BBBBBB' : '#666666'} />
                  <Text style={[styles.dateText, isDark && styles.textDark]}>
                    {selectedDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, isDark && styles.textDark]}>Start Time</Text>
                <View style={[styles.timeInputContainer, isDark && styles.timeInputContainerDark]}>
                  <Clock size={16} color={isDark ? '#BBBBBB' : '#666666'} />
                  <TextInput
                    style={[styles.timeInput, isDark && styles.textDark]}
                    placeholder="09:00"
                    placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, isDark && styles.textDark]}>Duration (min)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="60"
                  placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, isDark && styles.textDark]}>Room (optional)</Text>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder="Room number"
                  placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
                  value={room}
                  onChangeText={setRoom}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, isDark && styles.textDark]}>Notes (optional)</Text>
              <TextInput
                style={[styles.textArea, isDark && styles.textAreaDark]}
                placeholder="Additional information"
                placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Timer Settings</Text>
              
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, isDark && styles.textDark]}>Use timer</Text>
                <Switch
                  value={isTimer}
                  onValueChange={setIsTimer}
                  trackColor={{ false: '#D1D1D6', true: '#A1B1F8' }}
                  thumbColor={isTimer ? '#4361EE' : '#F4F3F4'}
                />
              </View>
              
              {isTimer && (
                <View style={styles.toggleRow}>
                  <Text style={[styles.toggleLabel, isDark && styles.textDark]}>Auto-submit</Text>
                  <Switch
                    value={isAutoSubmit}
                    onValueChange={setIsAutoSubmit}
                    trackColor={{ false: '#D1D1D6', true: '#A1B1F8' }}
                    thumbColor={isAutoSubmit ? '#4361EE' : '#F4F3F4'}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!title || !selectedCourse) && styles.saveButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!title || !selectedCourse}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalContentDark: {
    backgroundColor: '#1A1A1A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    color: '#FFFFFF',
  },
  courseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
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
  courseItemText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedCourseItemText: {
    fontWeight: '700',
    color: '#4361EE',
  },
  typeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  typeItemDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  selectedTypeItem: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  selectedTypeItemDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  typeItemText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedTypeItemText: {
    fontWeight: '700',
    color: '#4361EE',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateInputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeInputContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  timeInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    minHeight: 80,
  },
  textAreaDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#A1B1F8',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewCourseworkModal;