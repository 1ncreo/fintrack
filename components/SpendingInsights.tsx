"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, AlertTriangleIcon } from "lucide-react"
import { toast } from "sonner"

interface Insight {
  type: "overspending" | "improvement" | "warning"
  category: string
  message: string
  percentage?: number
}

export default function SpendingInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  async function fetchInsights() {
    try {
      const response = await fetch("/api/insights")
      if (!response.ok) throw new Error("Failed to fetch insights")
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error(error);
      toast.error("Failed to load spending insights")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading insights...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {insight.type === "overspending" && <ArrowUpIcon className="text-destructive" />}
              {insight.type === "improvement" && <ArrowDownIcon className="text-green-500" />}
              {insight.type === "warning" && <AlertTriangleIcon className="text-yellow-500" />}
              {insight.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insight.message}</p>
            {insight.percentage && (
              <p className="mt-2 font-medium">
                {insight.percentage > 0 ? "+" : ""}
                {insight.percentage}%
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

