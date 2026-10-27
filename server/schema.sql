CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY,
  receipt_code text NOT NULL UNIQUE,
  course_id text NOT NULL CHECK (course_id IN ('seminar', 'beginner', 'intermediate', 'advanced')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 50),
  note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 2000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacting', 'confirmed', 'cancelled')),
  admin_note text NOT NULL DEFAULT '' CHECK (char_length(admin_note) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS registrations_status_created_at_idx ON registrations (status, created_at DESC);
CREATE INDEX IF NOT EXISTS registrations_course_created_at_idx ON registrations (course_id, created_at DESC);
