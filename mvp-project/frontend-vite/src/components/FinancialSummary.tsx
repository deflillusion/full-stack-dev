import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStatistics } from "@/hooks/useStatistics"
import dayjs from "dayjs"
import { useEffect } from "react"

interface FinancialSummaryProps {
    currentMonth: string
    selectedAccount?: string
    accounts: { id: number; name: string }[]
}

export function FinancialSummary({ currentMonth, selectedAccount, accounts }: FinancialSummaryProps) {
    const { summary, isLoading, error, fetchMonthlySummary } = useStatistics();

    useEffect(() => {
        const [year, month] = currentMonth.split('-');
        const account = selectedAccount && selectedAccount !== "Все счета"
            ? accounts.find(a => a.id.toString() === selectedAccount) // теперь ищем по id
            : undefined;

        fetchMonthlySummary(year, month, account?.id);
    }, [currentMonth, selectedAccount]);

    if (isLoading) {
        return (
            <Card className="h-[250px]">
                <CardContent className="flex items-center justify-center h-full">
                    <p>Загрузка...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-[250px]">
                <CardContent className="flex items-center justify-center h-full">
                    <p className="text-red-600">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[250px]">
            <CardHeader>
                <CardTitle>Финансовый обзор за {dayjs(currentMonth).format("MMMM YYYY")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4">
                    {/* Баланс всегда сверху */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Баланс</h3>
                        <p className={`text-2xl ${(summary?.end_balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {summary?.end_balance.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                        </p>
                    </div>

                    {/* Доходы и расходы в две колонки */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">
                                <Badge variant="success">Доходы</Badge>
                            </h3>
                            <p className="text-2xl text-green-600">
                                {summary?.total_income.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">
                                <Badge variant="destructive">Расходы</Badge>
                            </h3>
                            <p className="text-2xl text-red-600">
                                {summary?.total_expenses.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}