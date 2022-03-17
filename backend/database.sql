DROP TABLE users;

CREATE TABLE users(
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  username VARCHAR(28) NOT NULL,
  room VARCHAR,
  PRIMARY KEY (username, room),
  points NUMERIC DEFAULT(0),
  guesses JSON
);
-- am besten einfach username is currently taken oder einfach lassen ^^


-- grant usage, select on sequence users_id_seq to multiwdev;
-- grant all on table users to multiwdev;