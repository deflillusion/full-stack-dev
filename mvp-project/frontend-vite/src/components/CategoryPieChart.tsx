"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Transaction, TransactionCategory } from "../types/transaction"
import { useMemo } from "react"

interface CategoryPieChartProps {
  transactions: Transaction[]
  type: "income" | "expense"
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const data = useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === type)
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<TransactionCategory, number>,
      )

    return Object.entries(categoryTotals).map(([category, total]) => ({
      name: category,
      value: total,
    }))
  }, [transactions, type])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

