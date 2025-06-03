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
          full_name: string | null
          faculty_id: string | null
          program_id: string | null
          year_of_study: number | null
          enrollment_completed: boolean
          enrollment_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'student' | 'instructor' | 'admin'
          full_name?: string | null
          faculty_id?: string | null
          program_id?: string | null
          year_of_study?: number | null
          enrollment_completed?: boolean
          enrollment_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'student' | 'instructor' | 'admin'
          full_name?: string | null
          faculty_id?: string | null
          program_id?: string | null
          year_of_study?: number | null
          enrollment_completed?: boolean
          enrollment_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      faculties: {
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
      programs: {
        Row: {
          id: string
          name: string
          faculty_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          faculty_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          faculty_id?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          code: string
          title: string
          program_id: string | null
          instructor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          program_id?: string | null
          instructor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          program_id?: string | null
          instructor_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      student_courses: {
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