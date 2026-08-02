import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NotesApp from "@/components/NotesApp";

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: folders }, { data: notes }] = await Promise.all([
    supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false }),
  ]);

  return (
    <NotesApp
      userId={user.id}
      userEmail={user.email ?? ""}
      initialFolders={folders ?? []}
      initialNotes={notes ?? []}
    />
  );
}
