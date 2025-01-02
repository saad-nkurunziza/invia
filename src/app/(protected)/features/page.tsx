import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Crumbs from "@/components/crumbs";

const userManagementFeatures = [
  {
    title: "User Management",
    description:
      "Support for multiple users with individual activity tracking.",
    details:
      "Easily manage different users within the app. Assign roles, monitor their actions, and maintain a secure and organized environment. Each user’s activities are tracked, ensuring that accountability is maintained across the platform.",
  },
  {
    title: "Admin Privileges",
    description:
      "Admin-level control with the ability to manage user roles and privileges.",
    details:
      "Admins have full control over the app’s settings, including user role management, access privileges, and the ability to view comprehensive logs. This feature ensures that only authorized users can perform critical operations.",
  },
];

const stockManagementFeatures = [
  {
    title: "Product Tracking",
    description: "Comprehensive tracking of all products in stock.",
    details:
      "Track the status and quantity of each product in real-time. The app provides detailed information on every item, including current stock levels, location within the warehouse, and movement history.",
  },
  {
    title: "Stock Management",
    description: "Real-time stock updates with easy management tools.",
    details:
      "Manage your stock with precision. The app allows for real-time updates on stock levels, making it easy to add, remove, or transfer stock as needed. You can also set up custom alerts to avoid stock shortages.",
  },
  {
    title: "Stock Alerts",
    description:
      "Automated alerts for low stock or other important notifications.",
    details:
      "Never miss a critical stock level again. Automated alerts notify you when stock is running low, helping you restock in time and avoid disruptions. Customize alert settings to meet your specific needs.",
  },
];

const analysisFeatures = [
  {
    title: "Profit Calculation",
    description: "Automatic calculation of profits based on sales and costs.",
    details:
      "Automatically calculate your profits by entering your sales data and costs. This feature provides real-time insights into your financial performance, helping you make informed business decisions.",
  },
  {
    title: "Monthly Analysis",
    description: "Detailed monthly reports and analysis of stock and sales.",
    details:
      "Generate detailed monthly reports that provide insights into your stock levels, sales, and overall business performance. Use this data to identify trends, optimize stock management, and drive business growth.",
  },
  {
    title: "Daily Analysis",
    description: "Track daily sales, stock levels, and performance.",
    details:
      "Monitor your daily operations closely with detailed reports on sales and stock levels. Identify patterns, address issues promptly, and adjust your strategies for better daily performance.",
  },
];

const transactionFeatures = [
  {
    title: "Transaction Tracking",
    description: "Monitor all transactions with detailed logs.",
    details:
      "Keep a comprehensive log of all transactions, including sales, purchases, and stock transfers. This feature ensures transparency and allows you to review past transactions for auditing and analysis purposes.",
  },
  {
    title: "Activity and Log Keeping",
    description:
      "Keep a log of all activities within the app for review and auditing.",
    details:
      "Maintain a detailed log of all activities performed within the app, from stock adjustments to user actions. This feature supports auditing and ensures that all actions are accountable and traceable.",
  },
];

const supplierFeatures = [
  {
    title: "Supplier Details Storage",
    description: "Store and manage information on all suppliers.",
    details:
      "Organize and store all your supplier information in one place. The app allows you to manage contact details, track order histories, and evaluate supplier performance, ensuring you maintain strong supplier relationships.",
  },
];

export default function FeaturesPage() {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Features" },
  ];
  return (
    <div className="space-y-8 flex flex-col">
      <Crumbs crumbs={crumbsLinks} />
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold">
            User Management Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userManagementFeatures.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <p className="text-sm">{feature.details}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold">
            Stock Management Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stockManagementFeatures.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <p className="text-sm">{feature.details}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold">Analysis Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisFeatures.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <p className="text-sm">{feature.details}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold">Transaction Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionFeatures.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <p className="text-sm">{feature.details}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold">
            Supplier Management Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supplierFeatures.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <p className="text-sm">{feature.details}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Link href="/" passHref>
          <Button variant="outline">Explore the App</Button>
        </Link>
      </div>
    </div>
  );
}
