-- init
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS users;

-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_books 
CREATE TABLE user_books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('want_to_read', 'reading', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, book_id)
);

-- reviews 
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE reviews
ADD CONSTRAINT unique_user_book_review UNIQUE (user_id, book_id);

-- test User(testuser=password1,reader2 = password2)
INSERT INTO users (username, email, password)
VALUES 
  ('testuser', 'test@user.com', '$2b$12$0zvFo89yqPOxZ4558IGvq.5/T2ScbUeM/2mzwXp6yQUDRx4jn4qG2'),
  ('reader2', 'reader2@example.com', '$2b$12$jofmqpDsSoQojOgzK5mfTOmiKH7ULXidKQ7ue2nwaKs7n9RENeMtu');

-- test book
INSERT INTO user_books (user_id, book_id, status, progress)
VALUES 
  (1, 'wrOQLV6xB-wC', 'reading', 40),
  (2, '6JbljwEACAAJ', 'want_to_read', 0);

-- test reviews
INSERT INTO reviews (user_id, book_id, rating, comment)
VALUES
  (1, 'wrOQLV6xB-wC', 5, 'Amazing book!'),
  (2, '6JbljwEACAAJ', 4, 'Looks interesting so far.');