import { useTransactions } from "@/hooks/useTransactions"
import { useEffect } from "react"
import type { Transaction } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import dayjs from "dayjs"
import { useAccounts } from "@/hooks/useAccounts"

export function TransactionList({
    selectedAccount,
    currentMonth
}: {
    selectedAccount?: string;
    currentMonth: string;
}) {
    const { accounts } = useAccounts();
    const account_id = selectedAccount && selectedAccount !== "Все счета"
        ? accounts?.find(acc => acc.name === selectedAccount)?.id
        : undefined;

    const { transactions, isLoading, error, fetchTransactions } =
        useTransactions(account_id, currentMonth);

    // Добавляем useEffect для отслеживания изменений
    useEffect(() => {
        console.log('TransactionList render:', {
            selectedAccount,
            account_id,
            currentMonth,
            accountsLength: accounts?.length
        });
        if (accounts?.length) {
            fetchTransactions();
        }
    }, [currentMonth, account_id, accounts, fetchTransactions]);


    const getTransactionTypeLabel = (type: Transaction["type"]) => {
        switch (type) {
            case "income":
                return "Доход"
            case "expense":
                return "Расход"
            case "transfer":
                return "Перевод"
            default:
                return "Неизвестно"
        }
    }

    const getTransactionTypeBadgeVariant = (type: Transaction["type"]) => {
        switch (type) {
            case "income":
                return "success"
            case "expense":
                return "destructive"
            case "transfer":
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
            {transactions.length === 0 ? (
                <Card className="p-4">
                    <div className="text-center text-gray-500">
                        Транзакции отсутствуют
                    </div>
                </Card>
            ) : (
                transactions.map((transaction) => (
                    <Card key={transaction.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="font-semibold mb-1">
                                    {transaction.description}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {dayjs(`${transaction.date} ${transaction.time}`).format("DD.MM.YYYY HH:mm")} • {transaction.category}
                                    {transaction.type === "transfer" && (
                                        <>
                                            <span> • из {transaction.fromAccount}</span>
                                            <span> в {transaction.toAccount}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <Badge variant={getTransactionTypeBadgeVariant(transaction.type)}>
                                    {getTransactionTypeLabel(transaction.type)}
                                </Badge>
                                <span className={
                                    transaction.type === "income"
                                        ? "text-green-500"
                                        : transaction.type === "expense"
                                            ? "text-red-500"
                                            : "text-blue-500"
                                }>
                                    {transaction.amount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(transaction)}
                            >
                                Изменить
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(transaction.id)}
                            >
                                Удалить
                            </Button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
}