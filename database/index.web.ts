export const db = null;

export function initDB() {
  console.warn("initDB skipped on web");
}

export function addJournalEntry() {
  console.warn("addJournalEntry skipped on web");
}

export function getAllJournalEntries() {
  return [];
}

export function getAllJournalEntriesForUser() {
  return [];
}

export function deleteJournalEntry() {
  console.warn("deleteJournalEntry skipped on web");
}

export function removeDuplicateEntries() {
  console.warn("removeDuplicateEntries skipped on web");
}

export function checkForDuplicate() {
  return false;
}
