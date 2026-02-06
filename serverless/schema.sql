CREATE TABLE IF NOT EXISTS transcripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  show TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  timecode TEXT,
  content TEXT NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS transcripts_fts USING fts5(
  content,
  content='transcripts',
  content_rowid='id'
);

CREATE INDEX IF NOT EXISTS idx_context ON transcripts(show, episode_id, line_number);

-- After bulk insert, rebuild FTS index:
-- INSERT INTO transcripts_fts(transcripts_fts) VALUES('rebuild');
