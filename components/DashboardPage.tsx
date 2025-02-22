"use client";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardView from "./DashboardView";
import TransactionsView from "./TransactionsView";
import BudgetView from "./BudgetView";
import { ThemeToggle } from "./ThemeToggle";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Personal Finance Tracker
        </h1>
        <ThemeToggle />
      </motion.div>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TabsList className="backdrop-blur-sm bg-background/50 border rounded-xl p-1">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatedTabContent value="dashboard">
          <DashboardView />
        </AnimatedTabContent>

        <AnimatedTabContent value="transactions">
          <TransactionsView />
        </AnimatedTabContent>

        <AnimatedTabContent value="budget">
          <BudgetView />
        </AnimatedTabContent>
      </Tabs>
    </motion.div>
  );
}

// Add this component at the bottom of the file
function AnimatedTabContent({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <TabsContent value={value}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </TabsContent>
  );
}