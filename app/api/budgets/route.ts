import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()

    // Get all budgets and actual spending
    const budgets = await db
      .collection("budgets")
      .aggregate([
        {
          $lookup: {
            from: "transactions",
            localField: "category",
            foreignField: "category",
            pipeline: [
              {
                $match: {
                  date: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ],
            as: "spending",
          },
        },
        {
          $project: {
            category: 1,
            amount: 1,
            spent: { $ifNull: [{ $arrayElemAt: ["$spending.total", 0] }, 0] },
            color: 1,
          },
        },
      ])
      .toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { category, amount } = await request.json()
    const db = await connectToDatabase()

    await db.collection("budgets").updateOne({ category }, { $set: { amount } }, { upsert: true })

    return NextResponse.json({ message: "Budget updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

