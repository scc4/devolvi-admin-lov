
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, roles } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (adminOnly && !roles.some(role => role === 'admin' || role === 'owner')) {
        // If authenticated but not admin/owner, redirect to login
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive"
        });
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate, roles, adminOnly]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Return children if authenticated and has required role (or adminOnly is false)
  return isAuthenticated && (!adminOnly || roles.some(role => role === 'admin' || role === 'owner')) ? <>{children}</> : null;
};

export default ProtectedRoute;
