"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import type { Folder, Note } from "@/types/note";
import { FileText } from "lucide-react";

type Props = {
  userId: string;
  userEmail: string;
  initialFolders: Folder[];
  initialNotes: Note[];
};

export default function NotesApp({
  userId,
  userEmail,
  initialFolders,
  initialNotes,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    null,
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNotes[0]?.id ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [titleDraft, setTitleDraft] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  const visibleNotes = useMemo(() => {
    let list = notes;
    if (selectedFolderId) {
      list = list.filter((n) => n.folder_id === selectedFolderId);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content_text.toLowerCase().includes(q),
      );
    }
    return list;
  }, [notes, selectedFolderId, searchQuery]);

  const saveNoteRef = useRef<Record<string, boolean>>({});

  const debouncedSave = useDebouncedCallback(
    async (
      id: string,
      updates: Partial<Pick<Note, "title" | "content" | "content_text">>,
    ) => {
      saveNoteRef.current[id] = true;
      await supabase.from("notes").update(updates).eq("id", id);
      saveNoteRef.current[id] = false;
    },
    600,
  );

  function patchNote(
    id: string,
    updates: Partial<Pick<Note, "title" | "content" | "content_text">>,
  ) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    );
    debouncedSave(id, updates);
  }

  async function handleNewNote() {
    debouncedSave.flush();
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title: "",
        content: {},
        content_text: "",
        folder_id: selectedFolderId,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Gagal bikin note baru:", error);
      return;
    }

    setNotes((prev) => [data as Note, ...prev]);
    setSelectedNoteId(data.id);
    setTitleDraft("");
  }

  async function handleDeleteNote(id: string) {
    debouncedSave.flush();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    await supabase.from("notes").delete().eq("id", id);
  }

  function handleSelectNote(id: string) {
    debouncedSave.flush();
    setSelectedNoteId(id);
    setTitleDraft(null);
  }

  function handleSelectFolder(id: string | null) {
    debouncedSave.flush();
    setSelectedFolderId(id);
  }

  async function handleNewFolder(name: string) {
    const { data, error } = await supabase
      .from("folders")
      .insert({ user_id: userId, name })
      .select()
      .single();
    if (error || !data) {
      console.error("Gagal bikin folder baru:", error);
      return;
    }
    setFolders((prev) => [...prev, data as Folder]);
  }

  async function handleRenameFolder(id: string, name: string) {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name } : f)),
    );
    await supabase.from("folders").update({ name }).eq("id", id);
  }

  async function handleDeleteFolder(id: string) {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setNotes((prev) =>
      prev.map((n) => (n.folder_id === id ? { ...n, folder_id: null } : n)),
    );
    if (selectedFolderId === id) setSelectedFolderId(null);
    await supabase.from("folders").delete().eq("id", id);
  }

  async function handleLogout() {
    debouncedSave.flush();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        userEmail={userEmail}
        folders={folders}
        notes={visibleNotes}
        selectedFolderId={selectedFolderId}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectFolder={handleSelectFolder}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onNewFolder={handleNewFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col">
        {selectedNote ? (
          <>
            <div className="border-b border-neutral-200 px-6 py-4">
              <input
                value={titleDraft ?? selectedNote.title}
                onChange={(e) => {
                  setTitleDraft(e.target.value);
                  patchNote(selectedNote.id, { title: e.target.value });
                }}
                placeholder="Judul note"
                className="w-full text-2xl font-semibold text-neutral-900 outline-none placeholder:text-neutral-300"
              />
            </div>
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onChange={(update) => patchNote(selectedNote.id, update)}
              onDelete={() => handleDeleteNote(selectedNote.id)}
            />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-300">
            <FileText size={48} strokeWidth={1.2} />
            <p className="text-sm">Pilih atau bikin note baru</p>
          </div>
        )}
      </div>
    </div>
  );
}
