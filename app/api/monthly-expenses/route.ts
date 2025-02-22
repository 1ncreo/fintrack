import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const monthlyExpenses = await db
      .collection("transactions")
      .aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$date" } } },
            totalExpense: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalExpense: 1,
          },
        },
        { $sort: { month: 1 } },
      ])
      .toArray()
    return NextResponse.json(monthlyExpenses)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch monthly expenses" }, { status: 500 })
  }
}

