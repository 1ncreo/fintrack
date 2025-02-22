"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardView from "./DashboardView";
import TransactionsView from "./TransactionsView";
import BudgetView from "./BudgetView";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardView />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsView />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetView />
        </TabsContent>
      </Tabs>
    </div>
  );
}