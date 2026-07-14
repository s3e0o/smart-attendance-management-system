import { supabase } from "./supabaseClient";

export async function getSubjects() {
  return await supabase
    .from("subjects")
    .select(`
      *,
      teachers (
        id,
        full_name
      ),
      sections (
        id,
        course_id,
        year_level,
        section_name,
        courses (
          id,
          code
        )
      )
    `)
    .order("subject_code", { ascending: true });
}

export async function createSubject(subjectData) {
  return await supabase
    .from("subjects")
    .insert([subjectData])
    .select();
}

export async function updateSubject(id, subjectData) {
  return await supabase
    .from("subjects")
    .update(subjectData)
    .eq("id", id)
    .select();
}

export async function deleteSubject(id) {
  return await supabase
    .from("subjects")
    .delete()
    .eq("id", id);
}