import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type Faculty = Database['public']['Tables']['faculties']['Row'];
type Program = Database['public']['Tables']['programs']['Row'] & {
  faculty: Faculty;
};
type Course = Database['public']['Tables']['courses']['Row'];

type EnrollmentDataContextType = {
  faculties: Faculty[];
  programs: Program[];
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  getProgramsByFaculty: (facultyId: string) => Program[];
  getCoursesByProgram: (programId: string) => Course[];
  refreshData: () => Promise<void>;
};

const EnrollmentDataContext = createContext<EnrollmentDataContextType | undefined>(undefined);

export function EnrollmentDataProvider({ children }: { children: React.ReactNode }) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch faculties
      const { data: facultiesData, error: facultiesError } = await supabase
        .from('faculties')
        .select('*')
        .order('name');

      if (facultiesError) throw facultiesError;

      // Fetch programs with faculty information
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select(`
          *,
          faculty:faculties(*)
        `)
        .order('name');

      if (programsError) throw programsError;

      // Fetch courses with program information
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('title');

      if (coursesError) throw coursesError;

      setFaculties(facultiesData || []);
      setPrograms(programsData || []);
      setCourses(coursesData || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching enrollment data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const getProgramsByFaculty = (facultyId: string): Program[] => {
    return programs.filter(program => program.faculty_id === facultyId);
  };

  const getCoursesByProgram = (programId: string): Course[] => {
    return courses.filter(course => course.program_id === programId);
  };

  const refreshData = async () => {
    await fetchEnrollmentData();
  };

  return (
    <EnrollmentDataContext.Provider
      value={{
        faculties,
        programs,
        courses,
        isLoading,
        error,
        getProgramsByFaculty,
        getCoursesByProgram,
        refreshData
      }}
    >
      {children}
    </EnrollmentDataContext.Provider>
  );
}

export function useEnrollmentData() {
  const context = useContext(EnrollmentDataContext);
  if (!context) {
    throw new Error('useEnrollmentData must be used within an EnrollmentDataProvider');
  }
  return context;
}