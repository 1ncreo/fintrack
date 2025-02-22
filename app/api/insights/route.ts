import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()

    // Get current month's data
    const currentMonth = new Date()
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)

    // Get transactions for current and previous month
    const [currentMonthData, previousMonthData, budgets] = await Promise.all([
      db
        .collection("transactions")
        .aggregate([
          {
            $match: {
              date: {
                $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
                $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1).toISOString(),
              },
            },
          },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
        ])
        .toArray(),

      db
        .collection("transactions")
        .aggregate([
          {
            $match: {
              date: {
                $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString(),
                $lt: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1).toISOString(),
              },
            },
          },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
        ])
        .toArray(),

      db.collection("budgets").find().toArray(),
    ])

    const insights = []

    // Compare with previous month
    currentMonthData.forEach((current) => {
      const previous = previousMonthData.find((p) => p._id === current._id)
      const budget = budgets.find((b) => b.category === current._id)

      if (previous) {
        const percentageChange = ((current.total - previous.total) / previous.total) * 100

        if (percentageChange > 20) {
          insights.push({
            type: "overspending",
            category: current._id,
            message: `Spending increased by ${percentageChange.toFixed(1)}% compared to last month`,
            percentage: percentageChange,
          })
        } else if (percentageChange < -20) {
          insights.push({
            type: "improvement",
            category: current._id,
            message: `Spending decreased by ${Math.abs(percentageChange).toFixed(1)}% compared to last month`,
            percentage: percentageChange,
          })
        }
      }

      // Budget warnings
      if (budget && current.total > budget.amount) {
        insights.push({
          type: "warning",
          category: current._id,
          message: `Over budget by $${(current.total - budget.amount).toFixed(2)}`,
          percentage: ((current.total - budget.amount) / budget.amount) * 100,
        })
      }
    })

    return NextResponse.json(insights)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

