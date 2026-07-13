import { supabase } from "../services/supabaseClient";

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function register(fullName, email, password) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}