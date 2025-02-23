import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/types/types"
import dayjs from "dayjs"

interface FinancialSummaryProps {
    transactions: Transaction[]
    currentMonth: string
}

export function FinancialSummary({ transactions, currentMonth }: FinancialSummaryProps) {
    const balance = transactions.reduce((acc, t) => {
        if (t.type === "income") return acc + t.amount
        if (t.type === "expense") return acc - t.amount
        return acc
    }, 0)

    const totalIncome = transactions.reduce((acc, t) => {
        if (t.type === "income") return acc + t.amount
        return acc
    }, 0)

    const totalExpenses = transactions.reduce((acc, t) => {
        if (t.type === "expense") return acc + t.amount
        return acc
    }, 0)

    return (
        <Card className="h-[250px]">
            <CardHeader>
                <CardTitle>Финансовый обзор за {dayjs(currentMonth).format("MMMM YYYY")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Баланс</h3>
                        <p className={`text-2xl ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>{balance.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            <Badge variant="success">Доходы</Badge>
                        </h3>
                        <p className="text-2xl text-green-600">{totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            <Badge variant="destructive">Расходы</Badge>
                        </h3>
                        <p className="text-2xl text-red-600">{totalExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

