import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const transactions = await db.collection("transactions").find().sort({ date: -1 }).toArray()
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { amount, date, description } = await request.json()
    const db = await connectToDatabase()
    const result = await db.collection("transactions").insertOne({ amount, date, description })
    return NextResponse.json({ message: "Transaction added successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 })
  }
}

