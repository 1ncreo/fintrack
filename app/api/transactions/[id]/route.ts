import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; // Extract the `id` from the resolved `params`
    const db = await connectToDatabase();
    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; // Extract the `id` from the resolved `params`
    const { amount, date, description, category } = await request.json();

    const db = await connectToDatabase();
    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { amount, date, description, category } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; // Extract the `id` from the resolved `params`
    const db = await connectToDatabase();
    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}