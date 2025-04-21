import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
export default function Auth() {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const {
    login,
    loading,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  if (isAuthenticated) {
    navigate("/dashboard");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (mode === 'login') {
        await login(email, password);
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (user) {
          const {
            data: roleData
          } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
          const roles = roleData?.map(r => r.role) || [];
          if (!roles.some(role => role === 'admin' || role === 'owner')) {
            setErrorMsg("Acesso negado. Apenas administradores e proprietários podem acessar este sistema.");
            await supabase.auth.signOut();
            return;
          }
          navigate("/dashboard");
        }
      } else {
        const {
          error
        } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) throw error;
        setSuccessMsg("Se existe uma conta com este email, você receberá um link para redefinir sua senha.");
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || (mode === 'login' ? "Erro ao autenticar" : "Erro ao enviar email de recuperação"));
    }
  };
  return <div className="min-h-screen w-full flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-[#103247]">
        <div className="max-w-md">
          <img alt="Login illustration" className="w-full h-auto" src="/lovable-uploads/862b136b-f93d-486c-8352-f932ff6cda87.png" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2A3547]">Bem-vindo à Devolvi</h1>
            <p className="text-[#637381] mt-2">
              {mode === 'login' ? "Entre na sua conta administrativa" : "Digite seu email para recuperar sua senha"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#637381]">
                  <User className="h-5 w-5" />
                </span>
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10 bg-white border-[#E0E4E8] focus:border-primary" />
              </div>

              {mode === 'login' && <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#637381]">
                    <LockKeyhole className="h-5 w-5" />
                  </span>
                  <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="pl-10 bg-white border-[#E0E4E8] focus:border-primary" />
                </div>}
            </div>

            {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {errorMsg}
              </div>}

            {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                {successMsg}
              </div>}

            <div className="flex justify-end">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'reset' : 'login')} className="text-sm text-primary hover:underline">
                {mode === 'login' ? 'Esqueceu sua senha?' : 'Voltar ao login'}
              </button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? mode === 'login' ? "Entrando..." : "Enviando..." : mode === 'login' ? "Entrar" : "Enviar link de recuperação"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-[#637381]">
              © {new Date().getFullYear()} Devolvi Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>;
}