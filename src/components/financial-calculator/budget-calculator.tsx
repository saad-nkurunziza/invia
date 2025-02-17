"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const BudgetCalculator = () => {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(3000);
  const [savings, setSavings] = useState(1000);
  const [investments, setInvestments] = useState(500);
  const [remaining, setRemaining] = useState(500);

  const calculateBudget = () => {
    const calculatedRemaining = income - (expenses + savings + investments);
    setRemaining(calculatedRemaining);
  };

  const data = [
    { name: "Expenses", value: expenses },
    { name: "Savings", value: savings },
    { name: "Investments", value: investments },
    { name: "Remaining", value: remaining },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Calculator</CardTitle>
        <CardDescription>
          Plan your monthly budget and visualize your spending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="income">Monthly Income ($)</Label>
              <Input
                id="income"
                placeholder="Enter monthly income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="expenses">Monthly Expenses ($)</Label>
              <Input
                id="expenses"
                placeholder="Enter monthly expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="savings">Monthly Savings ($)</Label>
              <Input
                id="savings"
                placeholder="Enter monthly savings"
                type="number"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="investments">Monthly Investments ($)</Label>
              <Input
                id="investments"
                placeholder="Enter monthly investments"
                type="number"
                value={investments}
                onChange={(e) => setInvestments(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calculateBudget}>Calculate Budget</Button>
          {remaining !== 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Budget Breakdown:</h3>
              <p>Remaining: ${remaining.toFixed(2)}</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
