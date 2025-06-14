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
          name: string
          role: 'student' | 'instructor' | 'admin'
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'student' | 'instructor' | 'admin'
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'student' | 'instructor' | 'admin'
          email?: string
          created_at?: string
          updated_at?: string
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
      courseworks: {
        Row: {
          id: string
          course_id: string
          title: string
          subject_area: string
          type: 'Quiz' | 'Test' | 'Exam' | 'Project'
          clo_ids: string[]
          domain: 'Cognitive' | 'Affective' | 'Psychomotor'
          description: string
          submission_format: string
          submission_length: string
          submission_method: 'online' | 'offline'
          special_instructions: string | null
          tasks: {
            title: string
            description: string
            due_date: string
          }[]
          start_time: string
          end_time: string
          geolocation_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          subject_area: string
          type: 'Quiz' | 'Test' | 'Exam' | 'Project'
          clo_ids: string[]
          domain: 'Cognitive' | 'Affective' | 'Psychomotor'
          description: string
          submission_format: string
          submission_length: string
          submission_method: 'online' | 'offline'
          special_instructions?: string
          tasks?: {
            title: string
            description: string
            due_date: string
          }[]
          start_time: string
          end_time: string
          geolocation_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          subject_area?: string
          type?: 'Quiz' | 'Test' | 'Exam' | 'Project'
          clo_ids?: string[]
          domain?: 'Cognitive' | 'Affective' | 'Psychomotor'
          description?: string
          submission_format?: string
          submission_length?: string
          submission_method?: 'online' | 'offline'
          special_instructions?: string
          tasks?: {
            title: string
            description: string
            due_date: string
          }[]
          start_time?: string
          end_time?: string
          geolocation_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          coursework_id: string
          student_id: string
          scan_time: string
          geolocation_verified: boolean
          status: 'Present' | 'Late' | 'Absent'
          created_at: string
        }
        Insert: {
          id?: string
          coursework_id: string
          student_id: string
          scan_time: string
          geolocation_verified?: boolean
          status: 'Present' | 'Late' | 'Absent'
          created_at?: string
        }
        Update: {
          id?: string
          coursework_id?: string
          student_id?: string
          scan_time?: string
          geolocation_verified?: boolean
          status?: 'Present' | 'Late' | 'Absent'
          created_at?: string
        }
      }
    }
  }
}