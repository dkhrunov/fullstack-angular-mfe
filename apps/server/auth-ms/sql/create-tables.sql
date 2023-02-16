-- Creation of token table
CREATE TABLE IF NOT EXISTS public."token" (
  id            SERIAL PRIMARY KEY,
  refreshToken  VARCHAR(200) NOT NULL,
  expiresIn     BIGINT NOT NULL,
  userId        INT NOT NULL,
  ip            VARCHAR(50) NOT NULL,
  userAgent     VARCHAR(200) NOT NULL
);