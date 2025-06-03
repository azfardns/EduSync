/*
  # Enrollment Schema Update

  1. Updates to profiles table
    - Add name fields (first, middle, last)
    - Add academic program and department references
    - Add year level and enrollment status
    - Add updated_at trigger

  2. New Tables
    - academic_programs
    - departments

  3. Security
    - Enable RLS on new tables
    - Update profile policies for new fields
*/

-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN first_name text,
ADD COLUMN middle_name text,
ADD COLUMN last_name text,
ADD COLUMN academic_program_id uuid,
ADD COLUMN department_id uuid,
ADD COLUMN year_level integer,
ADD COLUMN enrollment_completed boolean DEFAULT false;

-- Create academic_programs table
CREATE TABLE IF NOT EXISTS public.academic_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.profiles
ADD CONSTRAINT fk_academic_program
FOREIGN KEY (academic_program_id)
REFERENCES public.academic_programs(id)
ON DELETE SET NULL;

ALTER TABLE public.profiles
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id)
REFERENCES public.departments(id)
ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create policies for academic_programs
CREATE POLICY "Anyone can view academic programs"
ON public.academic_programs
FOR SELECT
TO authenticated
USING (true);

-- Create policies for departments
CREATE POLICY "Anyone can view departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

-- Update profile policies for new fields
CREATE POLICY "Users can update their enrollment info"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  (
    first_name IS NOT NULL AND
    last_name IS NOT NULL AND
    academic_program_id IS NOT NULL AND
    department_id IS NOT NULL AND
    year_level > 0
  )
);