
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Get the token and other parameters from the URL
  const token = searchParams.get('token');
  const type = searchParams.get('type');

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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);

    try {
      // Update user's password using the token
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Senha definida com sucesso!",
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

  useEffect(() => {
    const checkLink = async () => {
      if (!token) {
        toast({
          title: "Link inválido",
          description: "O link de confirmação está incompleto ou expirou.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      try {
        // Verify the token without updating the password yet
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'invite',
        });

        if (error) {
          console.error('Error verifying token:', error);
          toast({
            title: "Link inválido ou expirado",
            description: "O link de confirmação é inválido ou expirou. Entre em contato com o administrador para um novo convite.",
            variant: "destructive"
          });
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Error in token verification:', error);
        toast({
          title: "Erro na verificação",
          description: "Ocorreu um erro ao verificar o link de convite.",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkLink();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Complete seu cadastro</h2>
          <p className="mt-2 text-sm text-gray-600">
            Defina sua senha para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSetPassword} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Digite sua senha"
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirme a senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                placeholder="Digite sua senha novamente"
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
            {isLoading ? "Confirmando..." : "Confirmar cadastro"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
