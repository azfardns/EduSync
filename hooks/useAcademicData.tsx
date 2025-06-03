import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './useSupabase';
import type { Database } from '@/types/database';

type Faculty = {
  id: string;
  name: string;
};

type Program = {
  id: string;
  name: string;
  faculty_id: string;
};

type AcademicDataContextType = {
  faculties: Faculty[];
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  getProgramsByFaculty: (facultyId: string) => Program[];
};

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

export function AcademicDataProvider({ children }: { children: React.ReactNode }) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAcademicData() {
      try {
        setIsLoading(true);
        setError(null);

        const [facultiesResponse, programsResponse] = await Promise.all([
          supabase.from('faculties').select('*').order('name'),
          supabase.from('programs').select('*').order('name'),
        ]);

        if (facultiesResponse.error) throw facultiesResponse.error;
        if (programsResponse.error) throw programsResponse.error;

        setFaculties(facultiesResponse.data);
        setPrograms(programsResponse.data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching academic data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAcademicData();
  }, []);

  const getProgramsByFaculty = (facultyId: string) => {
    return programs.filter(program => program.faculty_id === facultyId);
  };

  return (
    <AcademicDataContext.Provider
      value={{
        faculties,
        programs,
        isLoading,
        error,
        getProgramsByFaculty,
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