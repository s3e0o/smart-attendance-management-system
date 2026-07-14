import { supabase } from "./supabaseClient";

/*
|--------------------------------------------------------------------------
| Get Subject Information
|--------------------------------------------------------------------------
*/

export async function getSubject(subjectId) {
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
        year_level,
        section_name,
        courses (
          id,
          code,
          name
        )
      )
    `)
    .eq("id", subjectId)
    .single();
}

/*
|--------------------------------------------------------------------------
| Get Students by Section
|--------------------------------------------------------------------------
*/

export async function getStudents(sectionId) {
  return await supabase
    .from("students")
    .select("*")
    .eq("section_id", sectionId)
    .eq("status", "active")
    .order("full_name", { ascending: true });
}

/*
|--------------------------------------------------------------------------
| Save Attendance
|--------------------------------------------------------------------------
*/

export async function saveAttendance(records) {
  return await supabase
    .from("attendance")
    .upsert(records, {
      onConflict: "student_id,subject_id,attendance_date",
    });
}

/*
|--------------------------------------------------------------------------
| Get Attendance by Date
|--------------------------------------------------------------------------
*/

export async function getAttendance(subjectId, attendanceDate) {
  return await supabase
    .from("attendance")
    .select(`
      student_id,
      status
    `)
    .eq("subject_id", subjectId)
    .eq("attendance_date", attendanceDate);
}