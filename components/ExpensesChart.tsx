"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "sonner"

interface MonthlyExpense {
  month: string
  totalExpense: number
}

export default function ExpensesChart() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMonthlyExpenses()
  }, [])

  async function fetchMonthlyExpenses() {
    try {
      const response = await fetch("/api/monthly-expenses")
      if (!response.ok) {
        throw new Error("Failed to fetch monthly expenses")
      }
      const data = await response.json()
      setMonthlyExpenses(data)
    } catch (error) {
      toast.error("Failed to fetch monthly expenses. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyExpenses}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalExpense" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

