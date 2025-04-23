
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

  // Get the token from the URL
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!token || type !== 'invite') {
      toast({
        title: "Link inválido",
        description: "O link de confirmação é inválido ou expirou.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [token, type, navigate]);

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
