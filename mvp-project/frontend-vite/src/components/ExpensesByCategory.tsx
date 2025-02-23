"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/types/types"
import { useMemo } from "react"

interface ExpensesByCategoryProps {
    transactions: Transaction[]
}

export function ExpensesByCategory({ transactions }: ExpensesByCategoryProps) {
    const { categorySums, totalExpenses } = useMemo(() => {
        const sums = transactions.reduce(
            (acc, t) => {
                if (t.type === "expense") {
                    acc.categorySums[t.category] = (acc.categorySums[t.category] || 0) + t.amount
                    acc.totalExpenses += t.amount
                }
                return acc
            },
            { categorySums: {} as Record<string, number>, totalExpenses: 0 },
        )
        return sums
    }, [transactions])

    return (
        <Card className="h-[670px] overflow-auto mb-20 md:mb-0">
            <CardHeader className="sticky top-0 bg-background z-20">
                <CardTitle>Расходы по категориям</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {Object.entries(categorySums)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, sum]) => {
                            const percentage = ((sum / totalExpenses) * 100).toFixed(1)
                            return (
                                <li key={category} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span>{category}</span>
                                    <span>
                                        ({percentage}%) {sum.toFixed(2)}
                                    </span>
                                </li>
                            )
                        })}
                </ul>
            </CardContent>
        </Card>
    )
}

