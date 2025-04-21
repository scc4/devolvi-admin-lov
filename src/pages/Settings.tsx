
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="admin@example.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Manage system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about system activities
              </p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Collect anonymous usage data
              </p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security">Advanced Security</Label>
              <p className="text-sm text-muted-foreground">
                Enable two-factor authentication
              </p>
            </div>
            <Switch id="security" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
