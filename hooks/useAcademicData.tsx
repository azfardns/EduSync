import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type AcademicProgram = Database['public']['Tables']['academic_programs']['Row'];
type Department = Database['public']['Tables']['departments']['Row'];

type AcademicDataContextType = {
  academicPrograms: AcademicProgram[];
  departments: Department[];
  isLoading: boolean;
  error: string | null;
};

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

export function AcademicDataProvider({ children }: { children: React.ReactNode }) {
  const [academicPrograms, setAcademicPrograms] = useState<AcademicProgram[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAcademicData() {
      try {
        setIsLoading(true);
        setError(null);

        const [programsResponse, departmentsResponse] = await Promise.all([
          supabase.from('academic_programs').select('*').order('name'),
          supabase.from('departments').select('*').order('name')
        ]);

        if (programsResponse.error) throw programsResponse.error;
        if (departmentsResponse.error) throw departmentsResponse.error;

        setAcademicPrograms(programsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching academic data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAcademicData();
  }, []);

  return (
    <AcademicDataContext.Provider
      value={{
        academicPrograms,
        departments,
        isLoading,
        error
      }}
    >
      {children}
    </AcademicDataContext.Provider>
  );
}

export function useAcademicData() {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicDataProvider');
  }
  return context;
}