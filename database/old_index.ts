// import { openDatabaseSync } from "expo-sqlite";

// export const db = openDatabaseSync("journal.db");

// export function initDB() {
//   //temp for development, gotta go when publishing
//   // db.execSync(`DROP TABLE IF EXISTS journal_entries;`);
//   db.execSync(
//     `CREATE TABLE IF NOT EXISTS journal_entries (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       content TEXT NOT NULL,
//       mood TEXT NOT NULL,
//       tags TEXT,
//       date INTEGER NOT NULL,
//       username TEXT NOT NULL,
//       synced INTEGER DEFAULT 0,
//       backend_id TEXT UNIQUE
//     );`
//   );
//   console.log("Database initialized");
// }

// export function addJournalEntry(entry: {
//   title: string;
//   content: string;
//   mood: string;
//   tags: string[];
//   date: number;
//   username: string;
// }) {
//   const title = entry.title.replace(/'/g, "''");
//   const content = entry.content.replace(/'/g, "''");
//   const mood = entry.mood.replace(/'/g, "''");
//   const tags = entry.tags.join(",").replace(/'/g, "''");
//   const username = entry.username.replace(/'/g, "''");

//   db.execSync(
//     `INSERT INTO journal_entries (title, content, mood, tags, date, username)
//      VALUES ('${title}', '${content}', '${mood}', '${tags}', ${entry.date}, '${username}')`
//   );
// }

// export function getAllJournalEntries(): any[] {
//   const rows = db.getAllSync<any>(
//     "SELECT * FROM journal_entries ORDER BY date DESC"
//   );
//   return rows.map((row) => ({
//     ...row,
//     tags: row.tags ? row.tags.split(",") : [],
//     date: new Date(row.date),
//   }));
// }

// export const getAllJournalEntriesForUser = (username: string) => {
//   const rows = db.getAllSync<any>(
//     `SELECT * FROM journal_entries WHERE username = '${username.replace(
//       /'/g,
//       "''"
//     )}' ORDER BY date DESC`
//   );

//   return rows.map((row) => ({
//     ...row,
//     tags: row.tags ? row.tags.split(",") : [],
//     date: new Date(row.date),
//   }));
// };

// export function deleteJournalEntry(id: number) {
//   db.execSync(`DELETE FROM journal_entries WHERE id = ${id}`);
// }

// export function removeDuplicateEntries(username: string) {
//   console.log("🧹 Starting duplicate cleanup...");

//   const deletedByBackendId = db.runSync(
//     `DELETE FROM journal_entries
//      WHERE id NOT IN (
//        SELECT MIN(id)
//        FROM journal_entries
//        WHERE backend_id IS NOT NULL
//        GROUP BY backend_id
//      )
//      AND backend_id IS NOT NULL`
//   );

//   console.log(
//     `   ✅ Removed ${deletedByBackendId.changes} duplicates by backend_id`
//   );

//   const deletedByContent = db.runSync(
//     `DELETE FROM journal_entries
//      WHERE id NOT IN (
//        SELECT MIN(id)
//        FROM journal_entries
//        WHERE username = '${username.replace(/'/g, "''")}'
//        GROUP BY title, content
//      )
//      AND username = '${username.replace(/'/g, "''")}'`
//   );

//   console.log(
//     `   ✅ Removed ${deletedByContent.changes} duplicates by content`
//   );

//   const remaining = db.getFirstSync<{ count: number }>(
//     `SELECT COUNT(*) as count FROM journal_entries WHERE username = '${username.replace(
//       /'/g,
//       "''"
//     )}'`
//   );

//   console.log(`   📊 Total entries remaining: ${remaining?.count || 0}`);
// }

// export function checkForDuplicate(entry: {
//   title: string;
//   content: string;
//   date: number;
//   username: string;
//   backend_id?: string;
// }): boolean {
//   const title = entry.title.replace(/'/g, "''");
//   const content = entry.content.replace(/'/g, "''");
//   const username = entry.username.replace(/'/g, "''");

//   if (entry.backend_id) {
//     const backendIdCheck = db.getAllSync<any>(
//       `SELECT id FROM journal_entries
//        WHERE backend_id = '${entry.backend_id.replace(/'/g, "''")}'
//        LIMIT 1`
//     );

//     if (backendIdCheck.length > 0) {
//       console.log(`⚠️ Duplicate found by backend_id: ${entry.backend_id}`);
//       return true;
//     }
//   }

//   const contentCheck = db.getAllSync<any>(
//     `SELECT id FROM journal_entries
//      WHERE title = '${title}'
//      AND content = '${content}'
//      AND username = '${username}'
//      LIMIT 1`
//   );

//   if (contentCheck.length > 0) {
//     console.log(`⚠️ Duplicate found by content: "${title}"`);
//     return true;
//   }

//   return false;
// }
