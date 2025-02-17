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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState<
    {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[]
  >([]);

  const calculateLoan = () => {
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthlyPayment =
      (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(monthlyPayment);

    let balance = loanAmount;
    const schedule = [];
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = monthlyPayment - interest;
      balance -= principal;
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal,
        interest,
        balance,
      });
    }
    setPaymentSchedule(schedule);
  };

  const LoanPDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Loan Payment Schedule</Text>
        <Text style={styles.subtitle}>Loan Details:</Text>
        <Text style={styles.text}>Loan Amount: ${loanAmount}</Text>
        <Text style={styles.text}>Interest Rate: {interestRate}%</Text>
        <Text style={styles.text}>Loan Term: {loanTerm} years</Text>
        <Text style={styles.text}>
          Monthly Payment: ${monthlyPayment.toFixed(2)}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subtitle}>Payment Schedule:</Text>
          {paymentSchedule.map((payment, index) => (
            <Text key={index} style={styles.text}>
              Month {payment.month}: Payment: ${payment.payment.toFixed(2)},
              Principal: ${payment.principal.toFixed(2)}, Interest: $
              {payment.interest.toFixed(2)}, Remaining Balance: $
              {payment.balance.toFixed(2)}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
        <CardDescription>
          Calculate your monthly loan payments and view the amortization
          schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="loanAmount">Loan Amount ($)</Label>
              <Input
                id="loanAmount"
                placeholder="Enter loan amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                placeholder="Enter interest rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                placeholder="Enter loan term"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calculateLoan}>Calculate</Button>
          {monthlyPayment > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Results:</h3>
              <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={paymentSchedule}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#8884d8"
                      name="Remaining Balance"
                    />
                    <Line
                      type="monotone"
                      dataKey="principal"
                      stroke="#82ca9d"
                      name="Principal"
                    />
                    <Line
                      type="monotone"
                      dataKey="interest"
                      stroke="#ffc658"
                      name="Interest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <PDFDownloadLink
                  document={<LoanPDFDocument />}
                  fileName="loan_schedule.pdf"
                >
                  <Button>Download PDF Report</Button>
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;
