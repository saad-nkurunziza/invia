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

const InvestmentCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(10);
  const [futureValue, setFutureValue] = useState(0);

  const calculateInvestment = () => {
    const r = rate / 100;
    const fv = principal * Math.pow(1 + r, time);
    setFutureValue(fv);

    const data = [];
    for (let year = 0; year <= time; year++) {
      const value = principal * Math.pow(1 + r, year);
      data.push({ year, value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Calculator</CardTitle>
        <CardDescription>
          Calculate the future value of your investment and visualize its
          growth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="principal">Principal Amount ($)</Label>
              <Input
                id="principal"
                placeholder="Enter principal amount"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                placeholder="Enter interest rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="time">Investment Period (years)</Label>
              <Input
                id="time"
                placeholder="Enter investment period"
                type="number"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calculateInvestment}>Calculate Investment</Button>
          {futureValue > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Future Value: ${futureValue.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;
