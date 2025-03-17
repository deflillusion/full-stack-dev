import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransactions } from "@/hooks/useTransactions"
import { useAIAnalysis } from "@/hooks/useAIAnalysis"
import { useToast } from "@/components/ui/use-toast"
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
import { Brain } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
    const [showAnalysis, setShowAnalysis] = useState(false)
    const { toast } = useToast()

    // Получаем ID выбранного счета
    const account_id = selectedAccount && selectedAccount !== "Все счета"
        ? parseInt(selectedAccount)
        : undefined

    const { transactions, isLoading, error } = useTransactions(account_id, currentMonth)
    const { analyzeTransactions, isLoading: isAnalyzing, error: analysisError, analysis } = useAIAnalysis()

    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    useEffect(() => {
        if (!transactions?.length) {
            setChartData([]) // Очищаем данные графика, если транзакции отсутствуют
            return
        }

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
    }, [transactions, currentMonth, selectedAccount])

    const handleAnalyze = async () => {
        if (!transactions?.length) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Нет транзакций для анализа",
            })
            return
        }

        setShowAnalysis(true)
        await analyzeTransactions()
    }

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
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>График доходов и расходов по дням</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !transactions?.length}
                >
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Анализирую..." : "Анализ с ИИ"}
                </Button>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => {
                                if (value >= 1000000) {
                                    return `${(value / 1000000).toFixed(1)}M`;
                                } else if (value >= 1000) {
                                    return `${(value / 1000).toFixed(0)}K`;
                                }
                                return value.toString();
                            }}
                            width={45}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${formatAmount(value)}`, "Сумма"]}
                            labelFormatter={(label) => `День ${label}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={24}
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

            <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                <DialogContent className="w-[90vw] max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Анализ транзакций</DialogTitle>
                    </DialogHeader>
                    {isAnalyzing && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    )}
                    {analysisError && (
                        <div className="text-red-500 py-4">
                            {analysisError}
                        </div>
                    )}
                    {analysis && (
                        <div className="mt-4 whitespace-pre-wrap text-sm">
                            {analysis}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}