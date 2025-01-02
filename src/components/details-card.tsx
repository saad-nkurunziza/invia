import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";

export default function DetailsCard({
  title,
  sub_header,
  products,
}: {
  title: string;
  sub_header: string;
  products: (
    | { name: string; id: string; stock: number }
    | { name: string; id: string; soldQuantity: number }
  )[];
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{sub_header}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {products.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.id}</p>
            </div>
            <div className="ml-auto font-medium">
              {" "}
              {"stock" in item ? item.stock : item.soldQuantity}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
