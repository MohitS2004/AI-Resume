-- AI Resume Builder Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  basic_info JSONB DEFAULT '{}',
  education JSONB DEFAULT '[]',
  experiences JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Resume jobs table
CREATE TABLE IF NOT EXISTS resume_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  job_description TEXT NOT NULL,
  jd_analysis JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing_jd', 'generating', 'reviewing', 'revising', 'complete', 'failed')),
  current_step TEXT DEFAULT 'Initializing...',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  sections JSONB,
  review_feedback JSONB,
  final_resume JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_jobs_user_id ON resume_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_jobs_status ON resume_jobs(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_jobs_updated_at ON resume_jobs;
CREATE TRIGGER update_resume_jobs_updated_at
  BEFORE UPDATE ON resume_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for profiles (allow all for MVP - single user)
DROP POLICY IF EXISTS "Allow all for profiles" ON profiles;
CREATE POLICY "Allow all for profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Policies for resume_jobs (allow all for MVP - single user)
DROP POLICY IF EXISTS "Allow all for resume_jobs" ON resume_jobs;
CREATE POLICY "Allow all for resume_jobs" ON resume_jobs
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default profile if not exists
INSERT INTO profiles (user_id, basic_info, education, experiences, projects, skills)
VALUES (
  'default_user',
  '{"fullName": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": ""}',
  '[]',
  '[]',
  '[]',
  '[]'
)
ON CONFLICT (user_id) DO NOTHING;
