
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordDDD = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);
  const { toast } = useToast();

  // Get the code from the URL (this is what Supabase uses in reset password links)
  const code = searchParams.get('code');

  useEffect(() => {
    // If there's no code, the link is invalid
    if (!code) {
      setInvalidLink(true);
      toast({
        title: "Link inválido",
        description: "O link de redefinição de senha é inválido ou expirou.",
        variant: "destructive"
      });
    }
  }, [code, toast]);

  // This would typically come from a dedicated domain service
  const validatePasswords = () => {
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // In a proper DDD implementation, this would be a use case
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords() || !code) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      }, {
        emailRedirectTo: window.location.origin + '/auth'
      });

      if (error) throw error;

      toast({
        title: "Senha alterada com sucesso!",
        description: "Você já pode fazer login no sistema.",
      });

      // Redirect to login page
      navigate('/auth');
    } catch (error: any) {
      console.error('Error setting password:', error);
      toast({
        title: "Erro ao definir senha",
        description: error.message || "Ocorreu um erro ao definir sua senha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // The rest of the component would stay the same
  // This is a presentation layer component that would use application layer use cases

  if (invalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Link inválido</h2>
          <p className="text-gray-600">
            O link de redefinição de senha é inválido ou expirou.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Voltar para login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Redefinir senha</h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite sua nova senha para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSetPassword} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Digite sua nova senha"
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirme a Nova Senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                placeholder="Digite sua nova senha novamente"
                minLength={6}
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500 text-sm">{passwordError}</div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Alterando senha..." : "Alterar senha"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordDDD;
