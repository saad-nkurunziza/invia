import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanCalculator from "@/components/financial-calculator/loan-calculator";
import BudgetCalculator from "@/components/financial-calculator/budget-calculator";
import InvestmentCalculator from "@/components/financial-calculator/investment-calculator";
import SavingsCalculator from "@/components/financial-calculator/savings-calculator";
import TaxCalculator from "@/components/financial-calculator/tax-calculator";
import { CardTitle } from "@/components/ui/card";

export default function page() {
  return (
    <main className="container mx-auto p-4">
      <div className=" mb-6">
        <CardTitle>Financial Calculator</CardTitle>
      </div>
      <Tabs defaultValue="loan">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="loan">Loan</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>
        <TabsContent value="loan">
          <LoanCalculator />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetCalculator />
        </TabsContent>
        <TabsContent value="investment">
          <InvestmentCalculator />
        </TabsContent>
        <TabsContent value="savings">
          <SavingsCalculator />
        </TabsContent>
        <TabsContent value="tax">
          <TaxCalculator />
        </TabsContent>
      </Tabs>
    </main>
  );
}
