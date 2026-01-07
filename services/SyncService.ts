import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { checkForDuplicate, db, removeDuplicateEntries } from "@/database";
import { BackendJournalEntry } from "@/types";
import { moodMapping, moodReverseMapping } from "@/hooks/mood-mapping";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const SyncService = {
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  async getAuthToken(): Promise<string | null> {
    const user = await AsyncStorage.getItem("loggedInUser");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.token || null;
    }
    return null;
  },

  async fetchBackendJournals(username: string): Promise<BackendJournalEntry[]> {
    const token = await this.getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${API_URL}/journals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch journals: ${response.status}`);
    }

    return await response.json();
  },

  async uploadJournalToBackend(entry: any): Promise<string> {
    const token = await this.getAuthToken();
    if (!token) throw new Error("No auth token found");

    const backendMood =
      moodMapping[entry.mood.toLowerCase()] || entry.mood.toUpperCase();

    const dateISO = new Date(entry.date).toISOString();

    const response = await fetch(`${API_URL}/journals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: entry.title,
        content: entry.content,
        mood: backendMood,
        tags: entry.tags || [],
        date: dateISO,
        username: entry.username,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to upload journal: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error("Backend did not return an ID");
    }

    return String(data.id);
  },

  markAsSynced(localId: number, backendId: string) {
    if (!backendId || typeof backendId !== "string") {
      console.error("❌ Invalid backendId:", backendId);
      throw new Error("Invalid backend ID");
    }

    const existing = db.getFirstSync<{ id: number }>(
      `SELECT id FROM journal_entries WHERE backend_id = '${backendId.replace(
        /'/g,
        "''"
      )}' LIMIT 1`
    );

    if (existing && existing.id !== localId) {
      console.log(
        `🗑️ Removing duplicate local entry ${localId} (backend_id already exists: ${backendId})`
      );
      db.execSync(`DELETE FROM journal_entries WHERE id = ${localId}`);
      return;
    }

    db.execSync(
      `UPDATE journal_entries 
     SET synced = 1, backend_id = '${backendId.replace(/'/g, "''")}' 
     WHERE id = ${localId}`
    );
  },

  getUnsyncedEntries(): any[] {
    const rows = db.getAllSync<any>(
      "SELECT * FROM journal_entries WHERE synced = 0 ORDER BY date ASC"
    );
    return rows.map((row) => ({
      ...row,
      tags: row.tags ? row.tags.split(",") : [],
      date: row.date,
    }));
  },

  getLocalEntriesMap(): Map<string, any> {
    const rows = db.getAllSync<any>(
      "SELECT * FROM journal_entries WHERE backend_id IS NOT NULL"
    );
    const map = new Map();
    rows.forEach((row) => {
      map.set(row.backend_id, {
        ...row,
        tags: row.tags ? row.tags.split(",") : [],
      });
    });
    return map;
  },

  async syncJournals(username: string): Promise<{
    uploaded: number;
    downloaded: number;
    errors: string[];
  }> {
    const results = { uploaded: 0, downloaded: 0, errors: [] as string[] };

    try {
      const online = await this.isOnline();
      if (!online) return results;

      console.log("🔄 Starting sync...");
      removeDuplicateEntries(username);

      const backendEntries = await this.fetchBackendJournals(username);
      const localMap = this.getLocalEntriesMap();

      console.log(
        `📦 Backend entries: ${backendEntries.length}, Local synced: ${localMap.size}`
      );

      for (const backendEntry of backendEntries) {
        if (!localMap.has(backendEntry.id)) {
          try {
            const title = backendEntry.title.replace(/'/g, "''");
            const content = backendEntry.content.replace(/'/g, "''");

            const localMood =
              moodReverseMapping[backendEntry.mood] ||
              backendEntry.mood.toLowerCase();
            const mood = localMood.replace(/'/g, "''");

            const tags = backendEntry.tags.join(",").replace(/'/g, "''");
            const backendId = backendEntry.id.replace(/'/g, "''");

            let dateInMs: number;

            if (typeof backendEntry.date === "string") {
              const parsed = new Date(backendEntry.date);
              dateInMs = parsed.getTime();
            } else if (backendEntry.date < 100000) {
              dateInMs = backendEntry.date * 24 * 60 * 60 * 1000;
            } else if (backendEntry.date > 1000000000000) {
              dateInMs = backendEntry.date;
            } else {
              dateInMs = backendEntry.date * 1000;
            }

            if (isNaN(dateInMs) || dateInMs <= 0) {
              throw new Error(`Invalid date value: ${backendEntry.date}`);
            }

            const isDuplicate = checkForDuplicate({
              title: backendEntry.title,
              content: backendEntry.content,
              date: dateInMs,
              username,
              backend_id: backendEntry.id,
            });

            if (isDuplicate) {
              console.log(`⏭️ Skipping duplicate entry: ${title}`);
              continue;
            }

            console.log(
              `📥 Downloading entry: ${title} | Backend ID: ${backendId}`
            );

            db.execSync(
              `INSERT OR IGNORE INTO journal_entries 
           (title, content, mood, tags, date, username, synced, backend_id)
           VALUES ('${title}', '${content}', '${mood}', 
                   '${tags}', ${dateInMs}, '${username}', 1, '${backendId}')`
            );

            results.downloaded++;
          } catch (error) {
            results.errors.push(
              `Failed to download entry ${backendEntry.id}: ${error}`
            );
          }
        }
      }

      const unsyncedEntries = this.getUnsyncedEntries();
      console.log(`📤 Unsynced local entries: ${unsyncedEntries.length}`);

      for (const entry of unsyncedEntries) {
        try {
          console.log(
            `📤 Uploading entry: ${entry.title} | Local ID: ${entry.id}`
          );
          const backendId = await this.uploadJournalToBackend(entry);
          this.markAsSynced(entry.id, backendId);
          results.uploaded++;
        } catch (error) {
          results.errors.push(`Failed to upload entry ${entry.id}: ${error}`);
        }
      }

      await AsyncStorage.setItem("lastSyncTime", new Date().toISOString());
      removeDuplicateEntries(username);

      console.log(
        `✅ Sync complete: ↑${results.uploaded} ↓${results.downloaded}`
      );

      return results;
    } catch (error) {
      results.errors.push(`Sync failed: ${error}`);
      return results;
    }
  },

  async getLastSyncTime(): Promise<Date | null> {
    const lastSync = await AsyncStorage.getItem("lastSyncTime");
    return lastSync ? new Date(lastSync) : null;
  },
};
