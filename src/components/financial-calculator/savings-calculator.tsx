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
import { Progress } from "@/components/ui/progress";

const SavingsCalculator = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(5);
  const [savingsPeriod, setSavingsPeriod] = useState(10);
  const [savingsGoal, setSavingsGoal] = useState(100000);
  const [totalSavings, setTotalSavings] = useState(0);

  const calculateSavings = () => {
    const r = interestRate / 100 / 12;
    const n = savingsPeriod * 12;
    const S = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    setTotalSavings(S);

    const data = [];
    for (let month = 0; month <= n; month++) {
      const savings = monthlyContribution * ((Math.pow(1 + r, month) - 1) / r);
      data.push({ month, savings });
    }
  };

  const progressPercentage = Math.min((totalSavings / savingsGoal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Calculator</CardTitle>
        <CardDescription>
          Calculate your total savings over time and track your progress towards
          your savings goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="monthlyContribution">
                Monthly Contribution ($)
              </Label>
              <Input
                id="monthlyContribution"
                placeholder="Enter monthly contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                placeholder="Enter interest rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="savingsPeriod">Savings Period (years)</Label>
              <Input
                id="savingsPeriod"
                placeholder="Enter savings period"
                type="number"
                value={savingsPeriod}
                onChange={(e) => setSavingsPeriod(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="savingsGoal">Savings Goal ($)</Label>
              <Input
                id="savingsGoal"
                placeholder="Enter savings goal"
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calculateSavings}>Calculate Savings</Button>
          {totalSavings > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Total Savings: ${totalSavings.toFixed(2)}</p>
              <div className="mt-2">
                <Label>Progress towards goal:</Label>
                <Progress value={progressPercentage} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {progressPercentage.toFixed(2)}% of goal achieved
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsCalculator;
