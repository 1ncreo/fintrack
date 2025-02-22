"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import SpendingInsights from "./SpendingInsights"

interface Budget {
  category: string
  amount: number
  spent: number
  color: string
}

export default function BudgetView() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBudgets()
  }, [])

  async function fetchBudgets() {
    try {
      const response = await fetch("/api/budgets")
      if (!response.ok) throw new Error("Failed to fetch budgets")
      const data = await response.json()
      setBudgets(data)
    } catch (error) {
      toast.error("Failed to load budgets")
    } finally {
      setIsLoading(false)
    }
  }

  async function updateBudget(category: string, amount: number) {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount }),
      })

      if (!response.ok) throw new Error("Failed to update budget")

      toast.success("Budget updated successfully")

      fetchBudgets()
    } catch (error) {
      toast.error("Failed to update budget")
    }
  }

  if (isLoading) {
    return <div>Loading budgets...</div>
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
              {/* Budget form implementation */}
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
  )
}

