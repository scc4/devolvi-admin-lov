
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          const roles = roleData?.map(r => r.role) || [];
          
          if (!roles.some(role => role === 'admin' || role === 'owner')) {
            setErrorMsg("Acesso negado. Apenas administradores e proprietários podem acessar este sistema.");
            await supabase.auth.signOut();
            return;
          }
          
          navigate("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        if (error) throw error;
        
        setSuccessMsg("Se existe uma conta com este email, você receberá um link para redefinir sua senha.");
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || (mode === 'login' ? "Erro ao autenticar" : "Erro ao enviar email de recuperação"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Devoly</h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? "Entre na sua conta" : "Recupere sua senha"}
          </p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 bg-primary text-white rounded-t-lg">
            <CardTitle className="text-xl text-center">
              {mode === 'login' ? "Login" : "Recuperação de Senha"}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {mode === 'login' ? "Entre com suas credenciais" : "Digite seu email para receber o link de recuperação"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    <User className="h-5 w-5 text-primary/60" />
                  </span>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-slate-50"
                  />
                </div>
              </div>
              
              {mode === 'login' && (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      <LockKeyhole className="h-5 w-5 text-primary/60" />
                    </span>
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="pl-10 bg-slate-50"
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm mb-4">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 text-green-600 p-2 rounded-md text-sm mb-4">
                  {successMsg}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading 
                  ? (mode === 'login' ? "Entrando..." : "Enviando...") 
                  : (mode === 'login' ? "Entrar" : "Enviar link de recuperação")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 justify-center border-t px-6 py-4 bg-slate-50">
            <p className="text-xs text-muted-foreground">
              {mode === 'login' 
                ? <button className="text-primary font-semibold underline" onClick={() => setMode('reset')}>Esqueceu sua senha?</button>
                : <button className="text-primary font-semibold underline" onClick={() => setMode('login')}>Voltar ao login</button>
              }
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Devoly Dashboard
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
