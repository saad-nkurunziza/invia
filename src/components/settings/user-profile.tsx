import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllUserInfo } from "@/server/user";
import EditUserForm from "../input/user-form";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";

export default async function UserProfileBox() {
  const user_info = await getAllUserInfo();
  if (!user_info) return null;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 py-6">
        <Tabs defaultValue="profile" className="space-y-4 w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <EditUserForm user={user_info} />
          </TabsContent>

          <TabsContent value="businesses" className="space-y-4">
            <h2 className="text-2xl font-bold">Business Memberships</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {user_info.businesses.map((business) => (
                <Card key={business.business_id}>
                  <CardHeader>
                    <CardTitle>{business.business.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Joined: {format(new Date(business.join_date), "PPP")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last Access:{" "}
                        {format(new Date(business.last_access), "PPP")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user_info.logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{log.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), "PPP")}
                        </p>
                      </div>
                      <Badge>{log.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <h2 className="text-2xl font-bold">Connected Accounts</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {user_info.accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {account.provider}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Connected with: {account.providerAccountId}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
