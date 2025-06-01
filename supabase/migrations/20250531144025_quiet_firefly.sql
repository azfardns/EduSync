-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Create courseworks table
CREATE TABLE IF NOT EXISTS public.courseworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Quiz', 'Test', 'Exam', 'Project')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  geolocation_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coursework_id uuid NOT NULL REFERENCES courseworks(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_time timestamptz NOT NULL,
  geolocation_verified boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('Present', 'Late', 'Absent')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(coursework_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courseworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Instructors can create courses"
  ON public.courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update own courses"
  ON public.courses
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Everyone can view courses"
  ON public.courses
  FOR SELECT
  TO authenticated
  USING (true);

-- Enrollments policies
CREATE POLICY "Students can enroll in courses"
  ON public.enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'student'
    )
  );

CREATE POLICY "Students can unenroll from courses"
  ON public.enrollments
  FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Users can view their enrollments"
  ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Courseworks policies
CREATE POLICY "Instructors can manage courseworks"
  ON public.courseworks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = courseworks.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view courseworks"
  ON public.courseworks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = courseworks.course_id
      AND enrollments.student_id = auth.uid()
    )
  );

-- Attendance policies
CREATE POLICY "Students can mark own attendance"
  ON public.attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = (
        SELECT course_id FROM courseworks
        WHERE courseworks.id = attendance.coursework_id
      )
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage attendance"
  ON public.attendance
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courseworks
      JOIN courses ON courses.id = courseworks.course_id
      WHERE courseworks.id = attendance.coursework_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own attendance"
  ON public.attendance
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courseworks_updated_at
  BEFORE UPDATE ON public.courseworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();