import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUser() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}