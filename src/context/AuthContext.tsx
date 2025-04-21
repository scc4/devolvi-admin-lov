
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}
type SupabaseUser = { id: string; email?: string | null };

interface AuthContextType {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  roles: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, avatar_url?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  profile: null,
  roles: [],
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and roles from Supabase
  const refreshProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    // Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(profileData || null);

    // Roles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    setRoles(rolesData ? rolesData.map((r) => r.role) : []);
    setLoading(false);
  };

  // Auth state listener (supabase best practice)
  useEffect(() => {
    let mounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // When user changes (login/logout), fetch profile & roles
  useEffect(() => {
    if (user?.id) {
      refreshProfile();
    } else {
      setProfile(null);
      setRoles([]);
    }
  }, [user?.id]);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  // Signup
  const signup = async (email: string, password: string, name: string, avatar_url?: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          name,
          avatar_url: avatar_url || null,
        },
      },
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setUser(null);
    setProfile(null);
    setRoles([]);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    profile,
    roles,
    loading,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
