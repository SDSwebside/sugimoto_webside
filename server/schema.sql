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

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  summary text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 500),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 30000),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_status_published_at_idx ON articles (status, published_at DESC);

CREATE TABLE IF NOT EXISTS article_images (
  id uuid PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('image/png', 'image/jpeg', 'image/webp')),
  image_data bytea NOT NULL,
  alt_text text NOT NULL DEFAULT '' CHECK (char_length(alt_text) <= 200),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS article_images_article_order_idx ON article_images (article_id, sort_order, created_at);
