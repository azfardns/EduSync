import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, TriangleAlert as AlertTriangle } from 'lucide-react-native';

type WeeklyCalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  assessments: any[];
  checkForConflicts: (date: Date) => boolean;
  isDark?: boolean;
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onSelectDate,
  assessments,
  checkForConflicts,
  isDark = false
}) => {
  // Helper function to generate week days
  const generateWeekDays = (startDate: Date) => {
    const days: Date[] = [];
    const currentDay = new Date(startDate);
    
    // Start from Sunday or Monday depending on locale
    const day = currentDay.getDay();
    const diff = currentDay.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    currentDay.setDate(diff);
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Initialize state with current week's days
  const [weekDays, setWeekDays] = useState<Date[]>(() => generateWeekDays(new Date()));
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  
  useEffect(() => {
    setWeekDays(generateWeekDays(currentWeekStart));
  }, [currentWeekStart]);
  
  const navigateToPreviousWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setCurrentWeekStart(newStartDate);
  };
  
  const navigateToNextWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setCurrentWeekStart(newStartDate);
  };
  
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const hasAssessments = (date: Date) => {
    return assessments.some(assessment => {
      const assessmentDate = new Date(assessment.date);
      return (
        assessmentDate.getDate() === date.getDate() &&
        assessmentDate.getMonth() === date.getMonth() &&
        assessmentDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Guard against empty weekDays array
  if (weekDays.length === 0) {
    return null;
  }
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={navigateToPreviousWeek}
        >
          <ChevronLeft size={20} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        
        <Text style={[styles.monthText, isDark && styles.textDark]}>
          {formatMonth(weekDays[0])} {weekDays[0].getFullYear()}
        </Text>
        
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={navigateToNextWeek}
        >
          <ChevronRight size={20} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {weekDays.map((date, index) => {
          const isDateToday = isToday(date);
          const isDateSelected = isSelected(date);
          const hasDateAssessments = hasAssessments(date);
          const hasConflict = checkForConflicts(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                isDateToday && styles.todayItem,
                isDateSelected && styles.selectedItem,
                isDateToday && isDateSelected && styles.todaySelectedItem,
                isDark && styles.dayItemDark,
                isDateToday && isDark && styles.todayItemDark,
                isDateSelected && isDark && styles.selectedItemDark,
                isDateToday && isDateSelected && isDark && styles.todaySelectedItemDark,
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text 
                style={[
                  styles.dayLetter,
                  isDateSelected && styles.selectedDayText,
                  isDateToday && styles.todayDayText,
                  isDark && styles.textDark,
                  isDateSelected && isDark && styles.selectedDayText
                ]}
              >
                {formatDay(date)}
              </Text>
              
              <Text 
                style={[
                  styles.dayNumber,
                  isDateSelected && styles.selectedDayText,
                  isDateToday && styles.todayDayText,
                  isDark && styles.textDark,
                  isDateSelected && isDark && styles.selectedDayText
                ]}
              >
                {date.getDate()}
              </Text>
              
              {hasDateAssessments && !hasConflict && (
                <View 
                  style={[
                    styles.assessmentIndicator,
                    isDateSelected && styles.selectedAssessmentIndicator
                  ]} 
                />
              )}
              
              {hasConflict && (
                <View style={styles.conflictContainer}>
                  <AlertTriangle size={12} color="#FF6B6B" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  navigationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  daysContainer: {
    paddingHorizontal: 8,
  },
  dayItem: {
    width: 44,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dayItemDark: {
    backgroundColor: '#333333',
    borderColor: '#444444',
  },
  todayItem: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFCC80',
  },
  todayItemDark: {
    backgroundColor: '#483C14',
    borderColor: '#6B5B28',
  },
  selectedItem: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  selectedItemDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  todaySelectedItem: {
    backgroundColor: '#E7ECFF',
    borderColor: '#4361EE',
  },
  todaySelectedItemDark: {
    backgroundColor: '#344181',
    borderColor: '#4361EE',
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  selectedDayText: {
    color: '#4361EE',
  },
  todayDayText: {
    color: '#FF9F1C',
  },
  assessmentIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4361EE',
    marginTop: 6,
  },
  selectedAssessmentIndicator: {
    backgroundColor: '#FFFFFF',
  },
  conflictContainer: {
    marginTop: 4,
  },
});

export default WeeklyCalendar;