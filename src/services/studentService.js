import { supabase } from "./supabaseClient";

export async function getStudents() {
    return await supabase
        .from("students")
        .select(`
      *,
      courses(code),
      sections(year_level, section_name)
    `)
        .order("student_number");
}

export async function createStudent(student) {
    return await supabase
        .from("students")
        .insert([student])
        .select();
}

export async function updateStudent(id, student) {
    return await supabase
        .from("students")
        .update(student)
        .eq("id", id)
        .select();
}

export async function deleteStudent(id) {
    return await supabase
        .from("students")
        .delete()
        .eq("id", id);
}