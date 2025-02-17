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

const calculateTax = (income: number) => {
  let tax = 0;

  if (income <= 720000) {
    tax = 0;
  } else if (income <= 1200000) {
    tax = (income - 720000) * 0.2;
  } else {
    tax = (1200000 - 720000) * 0.2 + (income - 1200000) * 0.3;
  }

  return tax;
};

const TaxCalculator = () => {
  const [income, setIncome] = useState(50000);
  const [taxLiability, setTaxLiability] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);

  const handleCalculateTax = () => {
    const tax = calculateTax(income);
    setTaxLiability(tax);
    setEffectiveTaxRate((tax / income) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Calculator</CardTitle>
        <CardDescription>
          Calculate your tax liability based on a simplified tax system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input
              id="income"
              placeholder="Enter annual income"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleCalculateTax}>Calculate Tax</Button>
          {taxLiability > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Tax Liability: ${taxLiability.toFixed(2)}</p>
              <p>Effective Tax Rate: {effectiveTaxRate.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
