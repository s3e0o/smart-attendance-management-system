import { supabase } from "./supabaseClient";

/*
|--------------------------------------------------------------------------
| Get Logged-in Teacher
|--------------------------------------------------------------------------
*/

export async function getCurrentTeacher() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError ?? new Error("User not found."),
    };
  }

  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return {
    data,
    error,
  };
}

/*
|--------------------------------------------------------------------------
| Get Teacher Subjects
|--------------------------------------------------------------------------
*/

export async function getTeacherSubjects(teacherId) {
  return await supabase
    .from("subjects")
    .select(`
      *,
      sections(
        id,
        year_level,
        section_name,
        courses(
          code
        )
      )
    `)
    .eq("teacher_id", teacherId)
    .eq("status", "active")
    .order("subject_code");
}