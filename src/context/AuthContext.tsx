
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
    try {
      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      setProfile(profileData || null);
  
      // Roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
        
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      }
  
      setRoles(rolesData ? rolesData.map((r) => r.role) : []);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast({
        title: "Erro",
        description: "Falha ao buscar dados do perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (email: string, password: string, name: string, avatar_url?: string) => {
    setLoading(true);
    try {
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
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Conta criada",
        description: "Verifique seu email para confirmar o registro."
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRoles([]);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
