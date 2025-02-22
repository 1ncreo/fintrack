"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import SpendingInsights from "./SpendingInsights";

interface Budget {
  category: string;
  amount: number;
  spent: number;
  color: string;
}

interface Category {
  name: string;
  color: string;
}

export default function BudgetView() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch budgets and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budgets
        const budgetResponse = await fetch("/api/budgets");
        if (!budgetResponse.ok) throw new Error("Failed to fetch budgets");
        const budgetData = await budgetResponse.json();
        setBudgets(budgetData);

        // Fetch categories
        const categoryResponse = await fetch("/api/categories");
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to update or create a budget
  async function updateBudget(category: string, amount: number) {
    if (amount <= 0) {
      toast.error("Budget amount must be greater than zero");
      return;
    }

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount }),
      });
      if (!response.ok) throw new Error("Failed to update budget");
      toast.success("Budget updated successfully");
      fetchBudgets(); // Refresh budgets after updating
    } catch (error) {
      toast.error("Failed to update budget");
    }
  }

  // Function to delete a budget
  async function deleteBudget(category: string) {
    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (!response.ok) throw new Error("Failed to delete budget");
      toast.success("Budget deleted successfully");
      fetchBudgets(); // Refresh budgets after deletion
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  }

  // Helper function to fetch budgets again
  async function fetchBudgets() {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      toast.error("Failed to load budgets");
    }
  }

  // Function to refresh budgets after transactions change
  async function refreshBudgetsAfterTransaction() {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(data); // Update the budgets state
    } catch (error) {
      toast.error("Failed to refresh budgets");
    }
  }

  if (isLoading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Budget Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Set Budget</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Category Budget</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const category = formData.get("category") as string;
                  const amount = parseFloat(formData.get("amount") as string);
                  if (!category || isNaN(amount)) {
                    toast.error("Please enter valid category and amount");
                    return;
                  }
                  await updateBudget(category, amount);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium">
                      Amount
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      className="mt-1 block w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => (
            <Card key={budget.category}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{budget.category}</span>
                  <span>
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress
                  value={(budget.spent / budget.amount) * 100}
                  className="h-2"
                  style={{ backgroundColor: budget.color }}
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {((budget.spent / budget.amount) * 100).toFixed(1)}% of budget used
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => deleteBudget(budget.category)}
                  >
                    Delete
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const amount = parseFloat(formData.get("amount") as string);
                          if (isNaN(amount) || amount <= 0) {
                            toast.error("Please enter a valid positive amount");
                            return;
                          }
                          await updateBudget(budget.category, amount);
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium">
                              New Amount
                            </label>
                            <input
                              id="amount"
                              name="amount"
                              type="number"
                              step="0.01"
                              min="0.01"
                              defaultValue={budget.amount}
                              required
                              className="mt-1 block w-full px-3 py-2 border rounded-md"
                            />
                          </div>
                          <Button type="submit">Update</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Spending Insights</h2>
        <SpendingInsights />
      </div>
    </div>
  );
}