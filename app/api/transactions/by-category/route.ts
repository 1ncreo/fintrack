import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()

    const categoryTotals = await db
      .collection("transactions")
      .aggregate([
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "name",
            as: "categoryInfo",
          },
        },
        {
          $project: {
            name: "$_id",
            total: 1,
            color: { $arrayElemAt: ["$categoryInfo.color", 0] },
          },
        },
      ])
      .toArray()

    return NextResponse.json(categoryTotals)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch category totals" }, { status: 500 })
  }
}

