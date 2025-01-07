/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `user_id` (text, unique, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `users` table
    - Add policy for inserting new users
    - Add policy for reading user data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read users"
  ON users
  FOR SELECT
  USING (true);