
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, User, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, signup, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate("/dashboard");
      } else {
        if (!name) {
          setErrorMsg("Name is required for signup.");
          return;
        }
        await signup(email, password, name, avatarUrl);
        setMode('login');
        setErrorMsg("Signup successful! You can now log in.");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Unable to authenticate");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Modernize Admin</h1>
          <p className="text-muted-foreground">{mode === "login" ? "Log in to your account" : "Sign up for a new account"}</p>
        </div>
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 bg-primary text-white rounded-t-lg">
            <CardTitle className="text-xl text-center">{mode === 'login' ? "Login" : "Sign Up"}</CardTitle>
            <CardDescription className="text-blue-100">{mode === "login" ? "Enter your credentials" : "Fill in your details"}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      <User className="h-5 w-5 text-primary/60" />
                    </span>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required={mode === 'signup'}
                      className="pl-10 bg-slate-50"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      <ImageIcon className="h-5 w-5 text-primary/60" />
                    </span>
                    <Input
                      type="url"
                      placeholder="Avatar image URL (optional)"
                      value={avatarUrl}
                      onChange={e => setAvatarUrl(e.target.value)}
                      className="pl-10 bg-slate-50"
                    />
                  </div>
                </div>
              )}
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
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    <LockKeyhole className="h-5 w-5 text-primary/60" />
                  </span>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-50"
                  />
                </div>
              </div>
              {errorMsg && (
                <div className={`p-2 rounded-md text-sm mb-4 ${errorMsg.startsWith("Signup successful") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                  {errorMsg}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (mode === "login" ? "Logging in..." : "Signing up...") : mode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 justify-center border-t px-6 py-4 bg-slate-50">
            <p className="text-xs text-muted-foreground">
              {mode === 'login' ?
                <>Don't have an account? <button className="text-primary font-semibold underline" onClick={() => setMode('signup')}>Sign up</button></> :
                <>Already have an account? <button className="text-primary font-semibold underline" onClick={() => setMode('login')}>Log in</button></>
              }
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Modernize Admin Dashboard
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
