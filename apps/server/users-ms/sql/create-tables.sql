-- Creation of user table
CREATE TABLE IF NOT EXISTS public."user" (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(200) NOT NULL,
  isConfirmed BOOLEAN DEFAULT false NOT NULL
);