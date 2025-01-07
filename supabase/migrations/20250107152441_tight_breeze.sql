/*
  # Create quiz results table

  1. New Tables
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (text, not null)
      - `score` (integer, not null)
      - `total_questions` (integer, not null)
      - `answers` (text array, not null)
      - `questions` (text array, not null)
      - `completed_at` (timestamptz, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `quiz_results` table
    - Add policy for users to insert their own results
    - Add policy for users to read their own results
*/

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  answers text[] NOT NULL,
  questions text[] NOT NULL,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own results"
  ON quiz_results
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read their own results"
  ON quiz_results
  FOR SELECT
  USING (true);