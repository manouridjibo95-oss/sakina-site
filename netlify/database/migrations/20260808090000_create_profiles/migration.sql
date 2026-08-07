CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  gender TEXT NOT NULL,
  practice TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
