import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpensesByCategory } from "@/hooks/useExpensesByCategory"
import { useEffect } from "react"
import dayjs from "dayjs"



interface ExpensesByCategoryProps {
    currentMonth?: string; // делаем опциональным
    selectedAccount?: string;
    accounts: Array<{
        id: number;
        name: string;
    }>;
}

export function ExpensesByCategory({
    currentMonth = dayjs().format("YYYY-MM"),
    selectedAccount,
    accounts
}: ExpensesByCategoryProps) {
    const { expenses, isLoading, error, fetchExpensesByCategory } = useExpensesByCategory();

    useEffect(() => {
        const [year, month] = currentMonth.split('-');
        const account = selectedAccount && selectedAccount !== "Все счета"
            ? accounts.find(a => a.id.toString() === selectedAccount) // теперь ищем по id
            : undefined;

        fetchExpensesByCategory(year, month, account?.id);
    }, [currentMonth, selectedAccount, accounts]);

    if (isLoading) {
        return (
            <Card className="h-[670px]">
                <CardContent className="flex items-center justify-center h-full">
                    <p>Загрузка...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-[670px]">
                <CardContent className="flex items-center justify-center h-full">
                    <p className="text-red-600">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[670px] overflow-auto">
            <CardHeader>
                <CardTitle>Расходы по категориям</CardTitle>
            </CardHeader>
            <CardContent>
                {expenses.length === 0 ? (
                    <p className="text-center text-gray-500">Нет данных о расходах</p>
                ) : (
                    <ul className="space-y-2">
                        {expenses.map(({ category, amount, percentage }) => (
                            <li key={category} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <span>{category}</span>
                                <span>
                                    {amount.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    {" ("}{percentage.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}