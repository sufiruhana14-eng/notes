export type Folder = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: Record<string, unknown>;
  content_text: string;
  created_at: string;
  updated_at: string;
};
