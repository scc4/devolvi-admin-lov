
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, User } from "lucide-react";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Modernize Admin</h1>
          <p className="text-muted-foreground">Log in to your admin dashboard</p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 bg-primary text-white rounded-t-lg">
            <CardTitle className="text-xl text-center">Administrator Login</CardTitle>
            <CardDescription className="text-blue-100">Enter your credentials to continue</CardDescription>
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-slate-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    <LockKeyhole className="h-5 w-5 text-primary/60" />
                  </span>
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-50"
                  />
                </div>
              </div>
              {errorMsg && (
                <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm mb-4">
                  {errorMsg}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4 bg-slate-50">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Modernize Admin Dashboard
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
