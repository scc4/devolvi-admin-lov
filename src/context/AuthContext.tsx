
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the AuthContextType
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing session on load
  useEffect(() => {
    // This would be replaced with actual Supabase session check
    const checkSession = async () => {
      try {
        // Mock check - will be replaced with Supabase
        setLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // This will be replaced with actual Supabase auth
      alert("Please connect Supabase to enable authentication");
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      // This will be replaced with actual Supabase auth
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
      throw error;
    }
  };
  
  // Value object
  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
