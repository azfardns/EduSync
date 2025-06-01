import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type Coursework = Database['public']['Tables']['courseworks']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

type CourseworkContextType = {
  courseworks: Coursework[];
  isLoading: boolean;
  error: string | null;
  addCoursework: (coursework: Omit<Coursework, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCoursework: (id: string, coursework: Partial<Coursework>) => Promise<void>;
  deleteCoursework: (id: string) => Promise<void>;
};

const CourseworkContext = createContext<CourseworkContextType | undefined>(undefined);

export function CourseworkProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courseworks, setCourseworks] = useState<Coursework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCourseworks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let courseIds: string[] = [];

        if (user.role === 'instructor') {
          // Get course IDs for instructor
          const { data: instructorCourses, error: coursesError } = await supabase
            .from('courses')
            .select('id')
            .eq('instructor_id', user.id);

          if (coursesError) throw coursesError;
          courseIds = instructorCourses.map(course => course.id);
        } else if (user.role === 'student') {
          // Get course IDs for enrolled courses
          const { data: enrollments, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', user.id);

          if (enrollmentsError) throw enrollmentsError;
          courseIds = enrollments.map(enrollment => enrollment.course_id);
        }

        // If no courses found, return empty array
        if (courseIds.length === 0) {
          setCourseworks([]);
          return;
        }

        // Fetch courseworks for the found course IDs
        const { data, error: courseworksError } = await supabase
          .from('courseworks')
          .select('*')
          .in('course_id', courseIds);

        if (courseworksError) throw courseworksError;
        setCourseworks(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching courseworks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseworks();
  }, [user]);

  const addCoursework = async (coursework: Omit<Coursework, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from('courseworks')
        .insert([coursework])
        .select()
        .single();

      if (insertError) throw insertError;

      setCourseworks(prev => [...prev, data]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCoursework = async (id: string, coursework: Partial<Coursework>) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('courseworks')
        .update(coursework)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCourseworks(prev => 
        prev.map(cw => cw.id === id ? { ...cw, ...data } : cw)
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCoursework = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('courseworks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setCourseworks(prev => prev.filter(cw => cw.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <CourseworkContext.Provider
      value={{
        courseworks,
        isLoading,
        error,
        addCoursework,
        updateCoursework,
        deleteCoursework,
      }}
    >
      {children}
    </CourseworkContext.Provider>
  );
}

export function useCoursework() {
  const context = useContext(CourseworkContext);
  if (!context) {
    throw new Error('useCoursework must be used within a CourseworkProvider');
  }
  return context;
}