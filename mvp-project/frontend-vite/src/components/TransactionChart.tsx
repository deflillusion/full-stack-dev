import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/types/transaction"
import dayjs from "dayjs"

interface TransactionChartProps {
    transactions: Transaction[]
}

export function TransactionChart({ transactions }: TransactionChartProps) {
    const chartData = transactions.reduce(
        (acc, transaction) => {
            const date = dayjs(transaction.date).format("YYYY-MM-DD")
            const existingData = acc.find((item) => item.date === date)

            if (existingData) {
                if (transaction.type === "income") existingData.income += transaction.amount
                else if (transaction.type === "expense") existingData.expense += transaction.amount
                // Для переводов не меняем значения
            } else {
                acc.push({
                    date,
                    income: transaction.type === "income" ? transaction.amount : 0,
                    expense: transaction.type === "expense" ? transaction.amount : 0,
                    transfer: transaction.type === "transfer" ? transaction.amount : 0,
                })
            }

            return acc
        },
        [] as { date: string; income: number; expense: number; transfer: number }[],
    )

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4ade80" name="Доходы" />
                <Bar dataKey="expense" fill="#f87171" name="Расходы" />
                <Bar dataKey="transfer" fill="#60a5fa" name="Переводы" />
            </BarChart>
        </ResponsiveContainer>
    )
}

