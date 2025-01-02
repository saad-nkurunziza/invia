import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";

export default function LowStockItems({
  products,
}: {
  products: { name: string; stock: number; id: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Items</CardTitle>
        <CardDescription>
          These items are running low on stock.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {products.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.id}</p>
            </div>
            <div className="ml-auto font-medium">{item.stock}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
