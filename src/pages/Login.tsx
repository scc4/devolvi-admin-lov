
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, LockKeyhole } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to login");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side with color and logo */}
      <div className="w-full md:w-1/2 bg-[#8A88F1] flex items-center justify-center relative p-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white">Devolvi</h1>
          <div className="absolute left-6 top-1/2 text-white">
            <div className="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="m12 19-7-7 7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo à Devolvi</h2>
            <p className="mt-2 text-gray-600">Entre na sua conta administrativa</p>
          </div>
          
          <Card className="shadow-none border-none">
            <CardContent className="p-0 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      <Mail className="h-5 w-5" />
                    </span>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 border rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      <LockKeyhole className="h-5 w-5" />
                    </span>
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-[#8A88F1] text-sm font-medium">
                    Esqueceu sua senha?
                  </a>
                </div>
                {errorMsg && (
                  <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm">
                    {errorMsg}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#8A88F1] hover:bg-[#7978D9] text-white py-2 h-12"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <CardFooter className="flex justify-center p-0 mt-6">
            <p className="text-xs text-gray-500">
              © {currentYear} Devolvi Dashboard
            </p>
          </CardFooter>
        </div>
      </div>
    </div>
  );
};

export default Login;
