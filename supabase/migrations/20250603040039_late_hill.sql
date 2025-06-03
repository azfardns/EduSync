/*
  # Mandatory Student Enrollment Schema

  1. Updates to profiles table
    - Add enrollment fields
    - Add academic relationship fields
    - Add enrollment status flags

  2. New Tables
    - faculties
    - programs
    - student_courses (for course enrollment tracking)

  3. Security
    - Enable RLS on all tables
    - Strict enrollment policies
    - One-time update restriction
*/

-- Drop existing incorrect columns if they exist
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS middle_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS academic_program_id,
DROP COLUMN IF EXISTS department_id;

-- Add correct columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN full_name text,
ADD COLUMN faculty_id uuid,
ADD COLUMN program_id uuid,
ADD COLUMN year_of_study integer,
ADD COLUMN enrollment_completed boolean DEFAULT false,
ADD COLUMN enrollment_locked boolean DEFAULT false;

-- Create faculties table
CREATE TABLE IF NOT EXISTS public.faculties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create programs table (linked to faculties)
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  faculty_id uuid NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, faculty_id)
);

-- Create student_courses join table
CREATE TABLE IF NOT EXISTS public.student_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Add program_id to courses table if not exists
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE;

-- Add foreign key constraints to profiles
ALTER TABLE public.profiles
ADD CONSTRAINT fk_faculty
FOREIGN KEY (faculty_id)
REFERENCES public.faculties(id)
ON DELETE SET NULL;

ALTER TABLE public.profiles
ADD CONSTRAINT fk_program
FOREIGN KEY (program_id)
REFERENCES public.programs(id)
ON DELETE SET NULL;

-- Enable RLS on all tables
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- Policies for faculties (read-only for authenticated users)
CREATE POLICY "Authenticated users can view faculties"
ON public.faculties
FOR SELECT
TO authenticated
USING (true);

-- Policies for programs (read-only for authenticated users)
CREATE POLICY "Authenticated users can view programs"
ON public.programs
FOR SELECT
TO authenticated
USING (true);

-- Policies for student_courses (students can only manage their own)
CREATE POLICY "Students can view their own courses"
ON public.student_courses
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own courses"
ON public.student_courses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- Strict enrollment policy - data becomes immutable after submission
CREATE POLICY "Students can update enrollment info only once"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id AND 
  enrollment_completed = false AND 
  enrollment_locked = false
)
WITH CHECK (
  auth.uid() = id AND
  full_name IS NOT NULL AND
  trim(full_name) != '' AND
  faculty_id IS NOT NULL AND
  program_id IS NOT NULL AND
  year_of_study BETWEEN 1 AND 4
);

-- Insert sample data for testing
INSERT INTO public.faculties (name) VALUES
('Faculty of Computer Science & Information Technology'),
('Faculty of Engineering'),
('Faculty of Business & Economics'),
('Faculty of Medicine'),
('Faculty of Arts & Social Sciences')
ON CONFLICT (name) DO NOTHING;

-- Insert sample programs
WITH faculty_cs AS (SELECT id FROM public.faculties WHERE name = 'Faculty of Computer Science & Information Technology'),
     faculty_eng AS (SELECT id FROM public.faculties WHERE name = 'Faculty of Engineering'),
     faculty_bus AS (SELECT id FROM public.faculties WHERE name = 'Faculty of Business & Economics')
INSERT INTO public.programs (name, faculty_id)
SELECT program_name, faculty_id FROM (
  VALUES 
    ('Bachelor of Computer Science', (SELECT id FROM faculty_cs)),
    ('Bachelor of Information Technology', (SELECT id FROM faculty_cs)),
    ('Bachelor of Software Engineering', (SELECT id FROM faculty_cs)),
    ('Bachelor of Mechanical Engineering', (SELECT id FROM faculty_eng)),
    ('Bachelor of Civil Engineering', (SELECT id FROM faculty_eng)),
    ('Bachelor of Electrical Engineering', (SELECT id FROM faculty_eng)),
    ('Bachelor of Business Administration', (SELECT id FROM faculty_bus)),
    ('Bachelor of Economics', (SELECT id FROM faculty_bus)),
    ('Bachelor of Accounting', (SELECT id FROM faculty_bus))
) AS programs(program_name, faculty_id)
ON CONFLICT (name, faculty_id) DO NOTHING;