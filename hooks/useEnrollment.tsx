import { createContext, useContext, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type Faculty = Database['public']['Tables']['faculties']['Row'];
type Program = Database['public']['Tables']['programs']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

type EnrollmentContextType = {
  faculties: Faculty[];
  programs: Program[];
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchFaculties: () => Promise<void>;
  fetchProgramsByFaculty: (facultyId: string) => Promise<void>;
  fetchCoursesByProgram: (programId: string, year: number) => Promise<void>;
  submitEnrollment: (data: {
    fullName: string;
    facultyId: string;
    programId: string;
    yearOfStudy: number;
    courseIds: string[];
  }) => Promise<void>;
};

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('faculties')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setFaculties(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching faculties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgramsByFaculty = async (facultyId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('name');

      if (fetchError) throw fetchError;
      setPrograms(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching programs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoursesByProgram = async (programId: string, year: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .eq('program_id', programId)
        .order('code');

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitEnrollment = async (data: {
    fullName: string;
    facultyId: string;
    programId: string;
    yearOfStudy: number;
    courseIds: string[];
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);

      // Update profile with enrollment data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          faculty_id: data.facultyId,
          program_id: data.programId,
          year_of_study: data.yearOfStudy,
          enrollment_completed: true,
          enrollment_locked: true,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Enroll in selected courses
      const courseEnrollments = data.courseIds.map(courseId => ({
        student_id: user.id,
        course_id: courseId,
      }));

      const { error: coursesError } = await supabase
        .from('student_courses')
        .insert(courseEnrollments);

      if (coursesError) throw coursesError;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EnrollmentContext.Provider
      value={{
        faculties,
        programs,
        courses,
        isLoading,
        error,
        fetchFaculties,
        fetchProgramsByFaculty,
        fetchCoursesByProgram,
        submitEnrollment,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
}