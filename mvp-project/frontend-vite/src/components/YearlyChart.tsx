import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLast12MonthsStatistics } from "@/hooks/useStatistics"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Brain } from "lucide-react"
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
import { useAIAnalysis } from "@/hooks/useAIAnalysis"
import { AIAnalysisDialog } from "@/components/AIAnalysisDialog"

interface YearlyChartProps {
    currentMonth: string
    selectedAccount: string
    selectedCategory: string
    categoryId?: number
    accounts: Array<{
        id: number
        name: string
    }>
    onAnalyzeClick?: () => void
}

const MONTHS_SHORT = {
    '01': 'Янв',
    '02': 'Фев',
    '03': 'Мар',
    '04': 'Апр',
    '05': 'Май',
    '06': 'Июн',
    '07': 'Июл',
    '08': 'Авг',
    '09': 'Сен',
    '10': 'Окт',
    '11': 'Ноя',
    '12': 'Дек'
};

export function YearlyChart({
    currentMonth,
    selectedAccount,
    selectedCategory,
    categoryId,
    accounts,
    onAnalyzeClick
}: YearlyChartProps) {
    const { monthlyData, isLoading, error, fetchLast12MonthsData } = useLast12MonthsStatistics();
    const { categories } = useCategories();
    const [showAIAnalysisDialog, setShowAIAnalysisDialog] = useState(false);

    const {
        analyzeTransactions,
        isLoading: analysisLoading,
        error: analysisError,
        analysis: analysisData
    } = useAIAnalysis();

    // Получаем ID выбранного счета
    const account_id = selectedAccount && selectedAccount !== "Все счета"
        ? parseInt(selectedAccount)
        : undefined;

    // Используем переданный categoryId если он есть, иначе вычисляем из selectedCategory
    const category_id = categoryId !== undefined ? categoryId : (
        selectedCategory && selectedCategory !== "Все категории" && categories
            ? categories.find(c => c.name === selectedCategory)?.id
            : undefined
    );

    // Форматирование данных для более удобного отображения на графике
    const formattedData = monthlyData.map(item => {
        const [year, month] = item.month.split('-');
        return {
            ...item,
            name: `${MONTHS_SHORT[month as keyof typeof MONTHS_SHORT]} ${year.slice(2)}`
        };
    });

    // Функция форматирования числа для отображения
    const formatAmount = (value: number): string => {
        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)}M`;
        } else if (value >= 1_000) {
            return `${(value / 1_000).toFixed(0)}K`;
        }
        return value.toFixed(0);
    };

    useEffect(() => {
        // Проверяем, что все необходимые данные доступны
        if (!currentMonth) return;

        console.log("YearlyChart: обновление данных при изменении:",
            { currentMonth, account_id, category_id });

        // Получаем функцию отмены при вызове fetchLast12MonthsData
        const cancelFetch = fetchLast12MonthsData(currentMonth, account_id, category_id);

        // Функция очистки, которая будет вызвана при размонтировании компонента
        // или перед следующим запуском эффекта
        return () => {
            console.log("YearlyChart: отмена предыдущего запроса данных");
            cancelFetch();
        };
    }, [fetchLast12MonthsData, currentMonth, account_id, category_id]);

    const handleAIAnalysisClick = () => {
        // Вызываем анализ ИИ с параметрами для глубокого анализа за 12 месяцев
        analyzeTransactions(account_id, category_id, currentMonth);
        setShowAIAnalysisDialog(true);
    };

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
        );
    }

    if (error) {
        console.log("YearlyChart: ошибка при загрузке данных:", error);
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>Статистика за последние 12 месяцев</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                console.log("YearlyChart: повторный запрос данных");
                                fetchLast12MonthsData(currentMonth, account_id, category_id);
                            }}
                        >
                            Попробовать снова
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!formattedData.length) {
        return (
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>Статистика за последние 12 месяцев</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center text-center text-gray-500">
                        <p className="mb-2">Нет данных для отображения</p>
                        <p className="text-sm">Добавьте транзакции, чтобы увидеть статистику за последние 12 месяцев</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[450px]">
            <CardHeader className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>График доходов и расходов по месяцам</CardTitle>
                        <CardDescription>Данные за последние 12 месяцев</CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 md:mt-0"
                        onClick={handleAIAnalysisClick}
                        disabled={analysisLoading}
                    >
                        {analysisLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Анализируем...
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-4 w-4" />
                                ИИ-анализ
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={formattedData}
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
                            tickFormatter={formatAmount}
                            width={35}
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--tooltip-bg)',
                                border: '1px solid var(--tooltip-border)',
                                borderRadius: '6px',
                                padding: '8px'
                            }}
                            labelStyle={{
                                color: 'var(--foreground)'
                            }}
                            formatter={(value: number) => [
                                new Intl.NumberFormat('ru-RU', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(value),
                                "Сумма"
                            ]}
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
            <AIAnalysisDialog
                open={showAIAnalysisDialog}
                onOpenChange={setShowAIAnalysisDialog}
                isLoading={analysisLoading}
                error={analysisError}
                analysis={analysisData}
            />
        </Card>
    );
} 