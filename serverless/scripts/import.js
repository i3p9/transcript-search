#!/usr/bin/env node

// Reads a mongoexport JSONL file and generates batched SQL files for D1 import.
//
// Usage:
//   node scripts/import.js data.jsonl
//
// Then apply each generated file:
//   npx wrangler d1 execute transcript-search --file=import_001.sql

const fs = require("fs");
const path = require("path");

const BATCH_SIZE = 500;
const ROWS_PER_FILE = 5000;

function escapeSQL(str) {
  if (str == null) return "NULL";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node scripts/import.js <path-to-data.jsonl>");
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);

  console.log(`Read ${lines.length} lines from ${inputPath}`);

  let fileIndex = 1;
  let rowsInCurrentFile = 0;
  let statements = [];

  function flushFile() {
    if (statements.length === 0) return;
    const filename = `import_${String(fileIndex).padStart(3, "0")}.sql`;
    const filePath = path.join(path.dirname(inputPath), filename);
    // Add FTS rebuild at the end of each file
    statements.push(
      "INSERT INTO transcripts_fts(transcripts_fts) VALUES('rebuild');\n"
    );
    fs.writeFileSync(filePath, statements.join("\n"), "utf-8");
    console.log(`Wrote ${filePath} (${rowsInCurrentFile} rows)`);
    fileIndex++;
    rowsInCurrentFile = 0;
    statements = [];
  }

  let batch = [];

  function flushBatch() {
    if (batch.length === 0) return;
    const values = batch
      .map(
        (r) =>
          `(${escapeSQL(r.show)}, ${escapeSQL(r.episode_id)}, ${r.line_number}, ${escapeSQL(r.timecode)}, ${escapeSQL(r.content)})`
      )
      .join(",\n  ");
    statements.push(
      `INSERT INTO transcripts (show, episode_id, line_number, timecode, content) VALUES\n  ${values};`
    );
    rowsInCurrentFile += batch.length;
    batch = [];
  }

  for (const line of lines) {
    let doc;
    try {
      doc = JSON.parse(line);
    } catch {
      console.warn("Skipping invalid JSON line");
      continue;
    }

    batch.push({
      show: doc.show,
      episode_id: doc.episode_id,
      line_number: parseInt(doc.line_number) || 0,
      timecode: doc.timecode || null,
      content: doc.content,
    });

    if (batch.length >= BATCH_SIZE) {
      flushBatch();
    }

    if (rowsInCurrentFile + batch.length >= ROWS_PER_FILE) {
      flushBatch();
      flushFile();
    }
  }

  // Flush remaining
  flushBatch();
  flushFile();

  console.log(`Done. Generated ${fileIndex - 1} SQL file(s).`);
}

main();
