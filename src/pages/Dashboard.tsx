
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "12,361",
      icon: Users,
      change: "+2.5%",
      changeType: "positive",
    },
    {
      title: "Active Sessions",
      value: "984",
      icon: LayoutDashboard,
      change: "+10.2%",
      changeType: "positive",
    },
    {
      title: "System Load",
      value: "28%",
      icon: Settings,
      change: "-5.1%",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-muted-foreground">
                      {i} hour{i !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full p-2 text-left rounded-md hover:bg-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Manage Users</span>
              </button>
              <button className="w-full p-2 text-left rounded-md hover:bg-slate-100 flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span>System Settings</span>
              </button>
              <button className="w-full p-2 text-left rounded-md hover:bg-slate-100 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
