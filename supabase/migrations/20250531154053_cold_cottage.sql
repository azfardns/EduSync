-- Modify courseworks table to include new fields
ALTER TABLE public.courseworks
ADD COLUMN subject_area text,
ADD COLUMN clo_ids text[],
ADD COLUMN domain text CHECK (domain IN ('Cognitive', 'Affective', 'Psychomotor')),
ADD COLUMN description text,
ADD COLUMN submission_format text,
ADD COLUMN submission_length text,
ADD COLUMN submission_method text CHECK (submission_method IN ('online', 'offline')),
ADD COLUMN special_instructions text,
ADD COLUMN tasks jsonb;

-- Add index for faster queries
CREATE INDEX idx_courseworks_course_id ON public.courseworks(course_id);