import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type Course = Database['public']['Tables']['courses']['Row'];

type CoursesContextType = {
  courses: Course[];
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
};

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch courses based on user role
      let coursesQuery = supabase.from('courses');
      
      if (user.role === 'instructor' || user.role === 'admin') {
        coursesQuery = coursesQuery.select('*').eq('instructor_id', user.id);
      } else {
        // For students, fetch enrolled courses
        coursesQuery = coursesQuery
          .select('*, enrollments!inner(*)')
          .eq('enrollments.student_id', user.id);
      }
      
      const { data: coursesData, error: coursesError } = await coursesQuery;
      if (coursesError) throw coursesError;

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const value = {
    courses,
    isLoading,
    fetchCourses,
  };

  return (
    <CoursesContext.Provider value={value}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
}