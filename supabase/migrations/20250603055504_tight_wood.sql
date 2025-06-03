/*
  # Create academic tables and update profiles

  1. New Tables
    - `faculties`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `programs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `faculty_id` (uuid, foreign key to faculties)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Existing Tables
    - Add to `profiles`:
      - `enrollment_completed` (boolean)
      - `faculty_id` (uuid, foreign key to faculties)
      - `program_id` (uuid, foreign key to programs)
      - `enrollment_locked` (boolean)
      - `year_of_study` (integer)
      - `full_name` (text)

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create faculties table
CREATE TABLE IF NOT EXISTS faculties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  faculty_id uuid NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'enrollment_completed'
  ) THEN
    ALTER TABLE profiles 
      ADD COLUMN enrollment_completed boolean DEFAULT false,
      ADD COLUMN faculty_id uuid REFERENCES faculties(id) ON DELETE SET NULL,
      ADD COLUMN program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
      ADD COLUMN enrollment_locked boolean DEFAULT false,
      ADD COLUMN year_of_study integer,
      ADD COLUMN full_name text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for faculties
CREATE POLICY "Anyone can view faculties"
  ON faculties
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert faculties"
  ON faculties
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update faculties"
  ON faculties
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for programs
CREATE POLICY "Anyone can view programs"
  ON programs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert programs"
  ON programs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update programs"
  ON programs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faculties_updated_at
  BEFORE UPDATE ON faculties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();