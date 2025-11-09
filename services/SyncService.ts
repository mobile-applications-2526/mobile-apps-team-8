import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { db, addJournalEntry } from "@/database";

interface BackendJournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: number;
  username: string;
}

export const SyncService = {
  //check wether device is online
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

  //fetch all from backend
  async fetchBackendJournals(): Promise<BackendJournalEntry[]> {
    const token = await this.getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${EXPO_PUBLIC_API_URL}/journals`, {
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

  //function to upload journal entry to backend
  async uploadJournalToBackend(entry: any): Promise<string> {
    const token = await this.getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${EXPO_PUBLIC_API_URL}/journals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        date: entry.date,
        username: entry.username,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload journal: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  },

  /**
   * Update backend_id and synced status in local DB
   */
  markAsSynced(localId: number, backendId: string) {
    db.execSync(
      `UPDATE journal_entries 
       SET synced = 1, backend_id = '${backendId.replace(/'/g, "''")}' 
       WHERE id = ${localId}`
    );
  },

  /**
   * Get all unsynced local entries
   */
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

  /**
   * Get all local entries with backend_id
   */
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

  /**
   * Main sync function
   */
  async syncJournals(username: string): Promise<{
    uploaded: number;
    downloaded: number;
    errors: string[];
  }> {
    const results = { uploaded: 0, downloaded: 0, errors: [] as string[] };

    try {
      // Check if device online
      const online = await this.isOnline();

      if (!online) {
        //No synching when offline
        return results;
      }

      //Upload entries to backend where synced = 0
      const unsyncedEntries = this.getUnsyncedEntries();
      for (const entry of unsyncedEntries) {
        try {
          const backendId = await this.uploadJournalToBackend(entry);
          this.markAsSynced(entry.id, backendId);
          results.uploaded++;
        } catch (error) {
          results.errors.push(`Failed to upload entry ${entry.id}: ${error}`);
        }
      }

      //Get All journals backend
      const backendEntries = await this.fetchBackendJournals(username);
      const localMap = this.getLocalEntriesMap();

      //Download online entries that aren't in SQLite yet
      for (const backendEntry of backendEntries) {
        if (!localMap.has(backendEntry.id)) {
          try {
            const title = backendEntry.title.replace(/'/g, "''");
            const content = backendEntry.content.replace(/'/g, "''");
            const mood = backendEntry.mood.replace(/'/g, "''");
            const tags = backendEntry.tags.join(",").replace(/'/g, "''");
            const backendId = backendEntry.id.replace(/'/g, "''");

            db.execSync(
              `INSERT INTO journal_entries 
               (title, content, mood, tags, date, username, synced, backend_id)
               VALUES ('${title}', '${content}', '${mood}', 
                       '${tags}', ${backendEntry.date}, '${username}', 1, '${backendId}')`
            );
            results.downloaded++;
          } catch (error) {
            results.errors.push(
              `Failed to download entry ${backendEntry.id}: ${error}`
            );
          }
        }
      }

      await AsyncStorage.setItem("lastSyncTime", new Date().toISOString());

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
