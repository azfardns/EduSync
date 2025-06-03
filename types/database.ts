export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'student' | 'instructor' | 'admin'
          first_name: string | null
          middle_name: string | null
          last_name: string | null
          academic_program_id: string | null
          department_id: string | null
          year_level: number | null
          enrollment_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'student' | 'instructor' | 'admin'
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          academic_program_id?: string | null
          department_id?: string | null
          year_level?: number | null
          enrollment_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'student' | 'instructor' | 'admin'
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          academic_program_id?: string | null
          department_id?: string | null
          year_level?: number | null
          enrollment_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      academic_programs: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          title: string
          instructor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          instructor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          instructor_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          created_at?: string
        }
      }
    }
  }
}