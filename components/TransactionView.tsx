"use client"

import TransactionList from "./TransactionList"
import TransactionForm from "./TransactionForm"

export default function TransactionsView() {
  return (
    <div className="space-y-4">
      <TransactionForm />
      <TransactionList />
    </div>
  )
}

