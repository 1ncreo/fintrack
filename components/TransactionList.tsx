"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TransactionForm from "./TransactionForm"
import { toast } from "sonner"

interface Transaction {
  _id: string
  amount: number
  date: string
  description: string
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const response = await fetch("/api/transactions")
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteTransaction(id: string) {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }
      toast.success("The transaction has been successfully deleted.")
      fetchTransactions()
      router.refresh()
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction. Please try again.")
    }
  }

  if (isLoading) {
    return <div>Loading transactions...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="secondary" onClick={() => setEditingTransaction(transaction)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => deleteTransaction(transaction._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              initialData={editingTransaction}
              onSuccess={() => {
                setEditingTransaction(null)
                fetchTransactions()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

