"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Trash2,
} from "lucide-react";
import type { Note } from "@/types/note";

type Props = {
  note: Note;
  onChange: (update: {
    content: Record<string, unknown>;
    content_text: string;
  }) => void;
  onDelete: () => void;
};

export default function NoteEditor({ note, onChange, onDelete }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Mulai nulis..." }),
    ],
    content: note.content && Object.keys(note.content).length > 0
      ? note.content
      : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none focus:outline-none min-h-[60vh] text-[15px] leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange({
        content: editor.getJSON(),
        content_text: editor.getText(),
      });
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editor) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-neutral-200 px-4 py-2">
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="ml-auto">
          <ToolbarButton onClick={onDelete}>
            <Trash2 size={16} />
          </ToolbarButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md p-1.5 text-neutral-600 transition hover:bg-neutral-100 ${
        active ? "bg-neutral-200 text-neutral-900" : ""
      }`}
    >
      {children}
    </button>
  );
}
