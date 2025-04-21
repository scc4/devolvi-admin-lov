
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { data: establishmentsCount = 0 } = useQuery({
    queryKey: ['establishments-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('establishments')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: collectionPointsCount = 0 } = useQuery({
    queryKey: ['collection-points-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('collection_points')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: activeCarriersCount = 0 } = useQuery({
    queryKey: ['active-carriers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('carriers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    }
  });

  const stats = [
    {
      title: "Total de Estabelecimentos",
      value: establishmentsCount.toString(),
      icon: Building,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pontos de Coleta",
      value: collectionPointsCount.toString(),
      icon: MapPin,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Transportadoras Ativas",
      value: activeCarriersCount.toString(),
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-[#2a3547]">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2a3547]">{stat.value}</div>
              <p className="mt-2 text-sm text-gray-500">
                Total registrado no sistema
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-[#2a3547]">Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We'll implement real-time activity tracking in the future */}
              <div className="flex items-center justify-center h-40 text-gray-500">
                O histórico de atividades será implementado em breve
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-[#2a3547]">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a 
                href="/dashboard/establishments" 
                className="w-full p-2 text-left rounded-md hover:bg-slate-100 flex items-center gap-2 text-[#2a3547] transition-colors"
              >
                <Building className="h-4 w-4 text-blue-500" />
                <span>Gerenciar Estabelecimentos</span>
              </a>
              <a 
                href="/dashboard/carriers" 
                className="w-full p-2 text-left rounded-md hover:bg-slate-100 flex items-center gap-2 text-[#2a3547] transition-colors"
              >
                <Users className="h-4 w-4 text-purple-500" />
                <span>Gerenciar Transportadoras</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
