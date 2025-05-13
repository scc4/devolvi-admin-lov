
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 text-[#2a3547]">Bem-vindo à Devolvi</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de gerenciamento administrativo</p>
        
        <Link to="/login">
          <Button className="bg-[#8A88F1] hover:bg-[#7978D9] px-8 py-6 h-auto text-lg">
            Acessar o sistema
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
