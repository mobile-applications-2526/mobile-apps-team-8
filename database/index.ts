import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('journal.db');

export function initDB() {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      mood TEXT NOT NULL,
      moodColor TEXT NOT NULL,
      moodIcon TEXT NOT NULL,
      tags TEXT,
      date INTEGER NOT NULL,
      synced INTEGER DEFAULT 0,
      backend_id TEXT
    );`
  );
  console.log('Database initialized');
}

export function addJournalEntry(entry: {
  title: string;
  content: string;
  mood: string;
  moodColor: string;
  moodIcon: string;
  tags: string[];
  date: number; 
}) {
  const title = entry.title.replace(/'/g, "''");
  const content = entry.content.replace(/'/g, "''");
  const mood = entry.mood.replace(/'/g, "''");
  const moodColor = entry.moodColor.replace(/'/g, "''");
  const moodIcon = entry.moodIcon.replace(/'/g, "''");
  const tags = entry.tags.join(',').replace(/'/g, "''");

  db.execSync(
    `INSERT INTO journal_entries (title, content, mood, moodColor, moodIcon, tags, date)
     VALUES ('${title}', '${content}', '${mood}', '${moodColor}', '${moodIcon}', '${tags}', ${entry.date})`
  );
}

export function getAllJournalEntries(): any[] {
  const rows = db.getAllSync<any>('SELECT * FROM journal_entries ORDER BY date DESC');
  return rows.map((row) => ({
    ...row,
    tags: row.tags ? row.tags.split(',') : [],
    date: new Date(row.date),
  }));
}

export function deleteJournalEntry(id: number) {
  db.execSync(`DELETE FROM journal_entries WHERE id = ${id}`);
}
