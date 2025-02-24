import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/hooks/useTransactions"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"

interface TransactionChartProps {
    currentMonth: string
    selectedAccount: string
    accounts: Array<{
        id: number
        name: string
    }>
}

export function TransactionChart({
    currentMonth,
    selectedAccount,
    accounts,
}: TransactionChartProps) {
    const [chartData, setChartData] = useState<
        Array<{
            name: string
            income: number
            expense: number
        }>
    >([])

    // Получаем ID выбранного счета
    const account_id = selectedAccount && selectedAccount !== "Все счета"
        ? accounts?.find((acc) => acc.name === selectedAccount)?.id
        : undefined

    const { transactions, isLoading, error } = useTransactions(account_id, currentMonth)

    useEffect(() => {
        if (!transactions?.length) return

        try {
            // Группируем транзакции по дням
            const groupedData = transactions.reduce((acc, transaction) => {
                if (!transaction.datetime) return acc

                const day = new Date(transaction.datetime).getDate().toString().padStart(2, "0")

                if (!acc[day]) {
                    acc[day] = { income: 0, expense: 0 }
                }

                // Используем Math.abs для отображения всех значений в положительной плоскости
                const amount = Math.abs(transaction.amount)

                if (transaction.transaction_type_id === 1) {
                    acc[day].income += amount
                } else if (transaction.transaction_type_id === 2) {
                    acc[day].expense += amount
                }

                return acc
            }, {} as Record<string, { income: number; expense: number }>)

            // Добавляем пустые дни для заполнения пробелов
            const daysInMonth = new Date(
                parseInt(currentMonth.split("-")[0]),
                parseInt(currentMonth.split("-")[1]),
                0
            ).getDate()

            for (let i = 1; i <= daysInMonth; i++) {
                const day = i.toString().padStart(2, "0")
                if (!groupedData[day]) {
                    groupedData[day] = { income: 0, expense: 0 }
                }
            }

            // Преобразуем данные для графика
            const formattedData = Object.entries(groupedData)
                .map(([day, data]) => ({
                    name: day,
                    income: Number(data.income.toFixed(2)),
                    expense: Number(data.expense.toFixed(2)),
                }))
                .sort((a, b) => parseInt(a.name) - parseInt(b.name))

            setChartData(formattedData)
        } catch (err) {
            console.error("Ошибка при обработке данных для графика:", err)
        }
    }, [transactions, currentMonth])

    if (isLoading) {
        return (
            <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                    Загрузка данных...
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full text-red-500">
                    {error}
                </CardContent>
            </Card>
        )
    }

    if (!chartData.length) {
        return (
            <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full text-gray-500">
                    Нет данных для отображения
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>График доходов и расходов по дням</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            label={{
                                value: "День месяца",
                                position: "bottom",
                                offset: -5
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Сумма (₽)",
                                angle: -90,
                                position: "insideLeft",
                                offset: -5
                            }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toFixed(2)} ₽`]}
                            labelFormatter={(label) => `День ${label}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                        />
                        <Bar
                            dataKey="income"
                            name="Доходы"
                            fill="#4ade80"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="expense"
                            name="Расходы"
                            fill="#f87171"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}