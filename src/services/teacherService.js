import { supabase } from "./supabaseClient";

export async function getTeachers() {
  return await supabase
    .from("teachers")
    .select(`
      *,
      courses (
        id,
        code,
        name
      )
    `)
    .order("employee_number", { ascending: true });
}

export async function createTeacher(teacher) {
  return await supabase
    .from("teachers")
    .insert([teacher])
    .select();
}

export async function updateTeacher(id, teacher) {
  return await supabase
    .from("teachers")
    .update(teacher)
    .eq("id", id)
    .select();
}

export async function deleteTeacher(id) {
  return await supabase
    .from("teachers")
    .delete()
    .eq("id", id);
}