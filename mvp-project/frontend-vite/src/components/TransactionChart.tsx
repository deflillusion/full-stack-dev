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
import { useCategories } from "@/hooks/useCategories"
import { Card as UICard, CardContent as UICardContent, CardHeader as UICardHeader, CardTitle as UICardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransactionChartProps {
    currentMonth: string
    selectedAccount: string
    selectedCategory: string
    categoryId?: number
    accounts: Array<{
        id: number
        name: string
    }>
}

export function TransactionChart({
    currentMonth,
    selectedAccount,
    selectedCategory,
    categoryId,
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

    // Получаем ID выбранной категории
    const { categories } = useCategories()
    const category_id = categoryId !== undefined ? categoryId : (
        selectedCategory && selectedCategory !== "Все категории" && categories
            ? categories.find(c => c.name === selectedCategory)?.id
            : undefined
    )

    const { transactions, isLoading, error } = useTransactions(account_id, currentMonth, category_id)
    const { analyzeTransactions, analyzeMonthlyTransactions, isLoading: isAnalyzing, error: analysisError, analysis } = useAIAnalysis()

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

        console.log("TransactionChart: обновление данных графика при изменении:",
            { currentMonth, selectedAccount, selectedCategory, transactionsCount: transactions.length });

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
    }, [transactions, currentMonth, selectedAccount, selectedCategory])

    const handleAnalyze = () => {
        if (!transactions?.length) {
            toast({
                title: "Нет данных для анализа",
                description: "Нет транзакций для выбранного периода.",
                variant: "destructive",
            })
            return
        }

        setShowAnalysis(true)
        analyzeMonthlyTransactions(account_id, category_id, currentMonth)
    }

    if (isLoading) {
        return (
            <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                        <p>Загрузка данных...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>График доходов и расходов по дням</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                console.log("TransactionChart: повторный запрос данных");
                                // Перезагрузка данных при ошибке
                                window.location.reload();
                            }}
                        >
                            Попробовать снова
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!chartData.length) {
        return (
            <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full text-gray-500">
                    <div className="flex flex-col items-center text-center">
                        <p className="mb-2">Нет данных для отображения</p>
                        <p className="text-sm">Добавьте транзакции за этот месяц, чтобы увидеть график</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-[450px]">
            <CardHeader className="space-y-2 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>График доходов и расходов по дням</CardTitle>
                        <p className="text-muted-foreground text-sm">Данные за текущий месяц</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !transactions?.length}
                        className="mt-2 md:mt-0"
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        {isAnalyzing ? "Анализ..." : "ИИ-анализ"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '0.75rem' }}
                            interval="preserveStartEnd"
                            minTickGap={10}
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
                            width={35}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${formatAmount(value)}`, "Сумма"]}
                            labelFormatter={(label) => `День ${label}`}
                            contentStyle={{
                                backgroundColor: 'var(--tooltip-bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '8px'
                            }}
                            labelStyle={{
                                color: 'var(--foreground)'
                            }}
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
                <DialogContent className="w-[90vw] max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>ИИ-анализ транзакций</DialogTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                            Анализ ваших финансовых данных за текущий месяц с помощью искусственного интеллекта.
                        </p>
                    </DialogHeader>
                    <div className="space-y-4">
                        {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                                <p>Анализируем ваши данные...</p>
                            </div>
                        )}

                        {analysisError && !isAnalyzing && (
                            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
                                <p className="text-red-600">{analysisError}</p>
                            </div>
                        )}

                        {analysis && !isAnalyzing && !analysisError && (
                            <div className="mt-2">
                                <Tabs defaultValue="trends">
                                    <TabsList className="grid w-full grid-cols-4 mb-4">
                                        <TabsTrigger value="trends">Тренды</TabsTrigger>
                                        <TabsTrigger value="seasonal">Сезонность</TabsTrigger>
                                        <TabsTrigger value="anomalies">Аномалии</TabsTrigger>
                                        <TabsTrigger value="budget">Бюджет</TabsTrigger>
                                    </TabsList>
                                    <div className="overflow-y-auto pr-1 max-h-[50vh]">
                                        <TabsContent value="trends" className="space-y-4">
                                            <UICard>
                                                <UICardHeader>
                                                    <UICardTitle>Основные тренды</UICardTitle>
                                                    <CardDescription>Анализ динамики доходов и расходов</CardDescription>
                                                </UICardHeader>
                                                <UICardContent className="space-y-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2">Выводы</h4>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            {analysis.trends?.insights?.map((insight, idx) => (
                                                                <li key={idx}>{insight}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    {analysis.trends?.recommendations?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Рекомендации</h4>
                                                            <ul className="list-disc pl-5 space-y-2">
                                                                {analysis.trends.recommendations.map((recommendation, idx) => (
                                                                    <li key={idx}>{recommendation}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </UICardContent>
                                            </UICard>
                                        </TabsContent>

                                        <TabsContent value="seasonal" className="space-y-4">
                                            <UICard>
                                                <UICardHeader>
                                                    <UICardTitle>Сезонный анализ</UICardTitle>
                                                    <CardDescription>Периодические изменения в финансах</CardDescription>
                                                </UICardHeader>
                                                <UICardContent>
                                                    <div>
                                                        <h4 className="font-medium mb-2">Выводы</h4>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            {analysis.seasonal?.insights?.map((insight, idx) => (
                                                                <li key={idx}>{insight}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </UICardContent>
                                            </UICard>
                                        </TabsContent>

                                        <TabsContent value="anomalies" className="space-y-4">
                                            <UICard>
                                                <UICardHeader>
                                                    <UICardTitle>Аномалии в транзакциях</UICardTitle>
                                                    <CardDescription>Необычные паттерны в расходах и доходах</CardDescription>
                                                </UICardHeader>
                                                <UICardContent>
                                                    {analysis.anomalies?.items?.length > 0 ? (
                                                        <>
                                                            <h4 className="font-medium mb-2">Найденные аномалии</h4>
                                                            <ul className="list-disc pl-5 space-y-2">
                                                                {analysis.anomalies.items.map((item, idx) => (
                                                                    <li key={idx}>
                                                                        <span className="font-medium">{item.period}:</span> {item.description}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    ) : (
                                                        <p>Аномалий не обнаружено</p>
                                                    )}
                                                </UICardContent>
                                            </UICard>
                                        </TabsContent>

                                        <TabsContent value="budget" className="space-y-4">
                                            <UICard>
                                                <UICardHeader>
                                                    <UICardTitle>Бюджетные рекомендации</UICardTitle>
                                                    <CardDescription>Советы по улучшению финансов</CardDescription>
                                                </UICardHeader>
                                                <UICardContent>
                                                    {analysis.budget?.recommendations?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Рекомендации</h4>
                                                            <ul className="list-disc pl-5 space-y-2">
                                                                {analysis.budget.recommendations.map((recommendation, idx) => (
                                                                    <li key={idx}>{recommendation}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {analysis.budget?.savings_potential && (
                                                        <div className="mt-4 p-3 bg-muted rounded-md">
                                                            <p className="font-medium">Потенциал экономии:</p>
                                                            <p>{analysis.budget.savings_potential}</p>
                                                        </div>
                                                    )}
                                                </UICardContent>
                                            </UICard>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}