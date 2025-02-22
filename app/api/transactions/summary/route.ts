import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()

    const summary = await db
      .collection("transactions")
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            avgTransaction: { $avg: "$amount" },
          },
        },
      ])
      .toArray()

    return NextResponse.json(summary[0] || { total: 0, count: 0, avgTransaction: 0 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 })
  }
}

