import { useTransactions } from "@/hooks/useTransactions"
import { useEffect } from "react"
import type { Transaction } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import dayjs from "dayjs"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { Pencil, Trash2 } from "lucide-react"

export function TransactionList({
    selectedAccount,
    currentMonth
}: {
    selectedAccount?: string;
    currentMonth: string;
}) {
    const { accounts } = useAccounts();
    const { categories } = useCategories();
    const account_id = selectedAccount && selectedAccount !== "Все счета"
        ? accounts?.find(acc => acc.name === selectedAccount)?.id
        : undefined;

    const { transactions, isLoading, error, fetchTransactions } =
        useTransactions(account_id, currentMonth);


    // Добавляем useEffect для отслеживания изменений
    useEffect(() => {
        // console.log('TransactionList render:', {
        //     selectedAccount,
        //     account_id,
        //     currentMonth,
        //     accountsLength: accounts?.length
        // });
        if (accounts?.length) {
            fetchTransactions();
        }
    }, [currentMonth, account_id, accounts, fetchTransactions]);


    const getTransactionTypeLabel = (type_id: number) => {
        switch (type_id) {
            case 1:
                return "Доход"
            case 2:
                return "Расход"
            case 3:
                return "Перевод"
            default:
                return "Неизвестно"
        }
    }

    const getTransactionTypeBadgeVariant = (type_id: number) => {
        switch (type_id) {
            case 1:
                return "success"
            case 2:
                return "destructive"
            case 3:
                return "secondary"
            default:
                return "default"
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteTransaction(id);
        } catch (err) {
            console.error('Ошибка при удалении транзакции:', err);
            // Здесь можно добавить уведомление об ошибке
        }
    };

    const handleEdit = async (transaction: Transaction) => {
        try {
            await updateTransaction(transaction);
        } catch (err) {
            console.error('Ошибка при обновлении транзакции:', err);
            // Здесь можно добавить уведомление об ошибке
        }
    };

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24">
                    Загрузка транзакций...
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24 text-red-500">
                    {error}
                </div>
            </Card>
        );
    }

    if (!transactions.length) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24 text-gray-500">
                    Транзакции не найдены
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                    <div className="flex">
                        {/* Левая часть */}
                        <div className="flex-1 space-y-2">
                            <div className="font-medium">
                                {categories?.find(c => c.id === transaction.category_id)?.name || 'Неизвестная категория'}
                            </div>
                            {transaction.description && (
                                <div className="text-gray-600">
                                    {transaction.description}
                                </div>
                            )}
                            <div className="text-gray-500">
                                {accounts?.find(a => a.id === transaction.account_id)?.name || 'Неизвестный счет'}
                            </div>
                        </div>

                        {/* Центральная часть - дата и время */}
                        <div className="mx-4 text-right text-gray-500">
                            <div>{dayjs(transaction.datetime).format("DD.MM.YYYY")}</div>
                            <div>{dayjs(transaction.datetime).format("HH:mm")}</div>
                        </div>

                        {/* Средняя часть справа - тип и сумма */}
                        <div className="flex flex-col items-end justify-between mr-4">
                            <Badge variant={getTransactionTypeBadgeVariant(transaction.transaction_type_id)}>
                                {getTransactionTypeLabel(transaction.transaction_type_id)}
                            </Badge>
                            <span className={`text-lg font-semibold ${transaction.transaction_type_id === 1
                                ? "text-green-500"
                                : transaction.transaction_type_id === 2
                                    ? "text-red-500"
                                    : "text-blue-500"
                                }`}>
                                {transaction.amount.toFixed(2)} ₽
                            </span>
                        </div>

                        {/* Правая часть - кнопки действий */}
                        <div className="flex flex-col justify-center space-y-2 ml-4 border-l pl-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)}
                                className="h-8 w-8"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(transaction.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}