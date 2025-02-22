import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", color: "#FF6B6B" },
  { name: "Transportation", color: "#4ECDC4" },
  { name: "Shopping", color: "#45B7D1" },
  { name: "Entertainment", color: "#96CEB4" },
  { name: "Housing", color: "#FFEEAD" },
  { name: "Utilities", color: "#D4A5A5" },
  { name: "Healthcare", color: "#9FA8DA" },
  { name: "Education", color: "#CE93D8" },
  { name: "Other", color: "#B0BEC5" },
]

export async function GET() {
  try {
    const db = await connectToDatabase()
    let categories = await db.collection("categories").find().toArray()

    // Initialize default categories if none exist
    if (categories.length === 0) {
      await db.collection("categories").insertMany(DEFAULT_CATEGORIES)
      categories = DEFAULT_CATEGORIES
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

