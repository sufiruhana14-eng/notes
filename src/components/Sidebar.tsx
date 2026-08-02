"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Folder as FolderIcon,
  FolderPlus,
  Notebook,
  LogOut,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import type { Folder, Note } from "@/types/note";

type Props = {
  userEmail: string;
  folders: Folder[];
  notes: Note[];
  selectedFolderId: string | null;
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectFolder: (id: string | null) => void;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onNewFolder: (name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onLogout: () => void;
};

export default function Sidebar({
  userEmail,
  folders,
  notes,
  selectedFolderId,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onSelectFolder,
  onSelectNote,
  onNewNote,
  onNewFolder,
  onRenameFolder,
  onDeleteFolder,
  onLogout,
}: Props) {
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  function submitNewFolder() {
    const name = newFolderName.trim();
    if (name) onNewFolder(name);
    setNewFolderName("");
    setAddingFolder(false);
  }

  function submitRename(id: string) {
    const name = editingFolderName.trim();
    if (name) onRenameFolder(id, name);
    setEditingFolderId(null);
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-neutral-200 bg-neutral-50">
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-yellow-900">
          <Notebook size={16} />
        </div>
        <span className="truncate text-sm font-medium text-neutral-700">
          {userEmail}
        </span>
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
          <Search size={14} className="text-neutral-400" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari notes"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-3">
        <button
          onClick={() => onSelectFolder(null)}
          className={`mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
            selectedFolderId === null
              ? "bg-yellow-100 font-medium text-yellow-900"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          <Notebook size={15} />
          Semua Notes
          <span className="ml-auto text-xs text-neutral-400">
            {notes.length}
          </span>
        </button>

        <div className="mt-3 flex items-center justify-between px-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Folder
          </span>
          <button
            onClick={() => setAddingFolder(true)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
          >
            <FolderPlus size={14} />
          </button>
        </div>

        {addingFolder && (
          <div className="mt-1 flex items-center gap-1 px-2.5">
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewFolder();
                if (e.key === "Escape") setAddingFolder(false);
              }}
              placeholder="Nama folder"
              className="w-full rounded border border-neutral-300 px-2 py-1 text-sm outline-none"
            />
            <button onClick={submitNewFolder} className="text-neutral-500">
              <Check size={15} />
            </button>
            <button
              onClick={() => setAddingFolder(false)}
              className="text-neutral-400"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="mt-1">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                selectedFolderId === folder.id
                  ? "bg-yellow-100 font-medium text-yellow-900"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {editingFolderId === folder.id ? (
                <>
                  <FolderIcon size={15} />
                  <input
                    autoFocus
                    value={editingFolderName}
                    onChange={(e) => setEditingFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitRename(folder.id);
                      if (e.key === "Escape") setEditingFolderId(null);
                    }}
                    className="w-full rounded border border-neutral-300 px-1 py-0.5 text-sm outline-none"
                  />
                  <button onClick={() => submitRename(folder.id)}>
                    <Check size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className="flex flex-1 items-center gap-2 truncate text-left"
                  >
                    <FolderIcon size={15} />
                    <span className="truncate">{folder.name}</span>
                  </button>
                  <span className="text-xs text-neutral-400">
                    {notes.filter((n) => n.folder_id === folder.id).length}
                  </span>
                  <button
                    onClick={() => {
                      setEditingFolderId(folder.id);
                      setEditingFolderName(folder.name);
                    }}
                    className="hidden text-neutral-400 hover:text-neutral-700 group-hover:block"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteFolder(folder.id)}
                    className="hidden text-neutral-400 hover:text-red-600 group-hover:block"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Notes
          </span>
        </div>

        <div className="mt-1 pb-4">
          {notes.length === 0 && (
            <p className="px-2.5 py-2 text-sm text-neutral-400">
              Belum ada notes
            </p>
          )}
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`mb-0.5 flex w-full flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left transition ${
                selectedNoteId === note.id
                  ? "bg-yellow-100"
                  : "hover:bg-neutral-100"
              }`}
            >
              <span className="w-full truncate text-sm font-medium text-neutral-800">
                {note.title || "Note tanpa judul"}
              </span>
              <span className="w-full truncate text-xs text-neutral-400">
                {note.content_text || "Kosong"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 p-3">
        <button
          onClick={onNewNote}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          <Plus size={15} />
          Note baru
        </button>
        <button
          onClick={onLogout}
          title="Logout"
          className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-100"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}
