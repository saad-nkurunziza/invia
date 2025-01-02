import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getBusinessDetails } from "@/server/query/businesses";

export default async function BusinessProfileBox() {
  const business = await getBusinessDetails();
  if (!business) return null;

  return (
    <div className="space-y-6 py-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{business.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Registration</p>
                  <p className="text-sm text-muted-foreground">
                    {business.registration_number}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Currency</p>
                  <p className="text-sm text-muted-foreground">
                    {business.currency}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">
                    {business.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {business.tel}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {business.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {business.products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.current_version?.stock ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price:{" "}
                  {product.current_version
                    ? product.current_version.selling_price.toString()
                    : "N/A"}
                </p>
                <Badge>{product.current_version?.status ?? "N/A"}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {business.workers.map((worker) => (
              <Card key={worker.user_id}>
                <CardHeader>
                  <CardTitle>{worker.user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Joined: {format(new Date(worker.join_date), "PPP")}
                  </p>
                  <Badge>{worker.user.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          {business.suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle>{supplier.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contact: {supplier.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Address: {supplier.address}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {business.transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <CardTitle>{transaction.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Date: {format(new Date(transaction.created_at), "PPP")}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
