"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import ExpensesChart from "./ExpensesChart";

interface CategoryTotal {
  name: string;
  total: number;
  color: string;
}

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export default function DashboardView() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [expensesRes, categoriesRes, transactionsRes] = await Promise.all([
        fetch("/api/transactions/summary"),
        fetch("/api/transactions/by-category"),
        fetch("/api/transactions?limit=5"),
      ]);
      const [expensesData, categoriesData, transactionsData] = await Promise.all([
        expensesRes.json(),
        categoriesRes.json(),
        transactionsRes.json(),
      ]);
      setTotalExpenses(expensesData.total);
      setCategoryTotals(categoriesData);
      setRecentTransactions(transactionsData);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ExpensesChart />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend Section */}
          <div className="mt-4 space-y-2">
            {categoryTotals.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction._id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-medium">${transaction.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}