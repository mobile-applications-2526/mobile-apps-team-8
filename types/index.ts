export type User = {
  id?: number;
  email?: string;
  password: string;
  username?: string;
};

export type BackendJournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: number | string;
  username: string;
};
