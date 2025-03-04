import { useState, useEffect } from "react"
import { useTransactions } from "@/hooks/useTransactions"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditTransactionDialog } from "./EditTransactionDialog"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionListProps {
    selectedAccount?: string
    currentMonth: string
}

export function TransactionList({ selectedAccount, currentMonth }: TransactionListProps) {
    const [editingTransaction, setEditingTransaction] = useState<any>(null)
    const { transactions, isLoading, error, fetchTransactions, deleteTransaction, updateTransaction, addTransaction } = useTransactions(
        selectedAccount ? parseInt(selectedAccount) : undefined,
        currentMonth
    )
    const { accounts } = useAccounts()
    const { categories } = useCategories()

    useEffect(() => {
        if (accounts?.length) {
            fetchTransactions()
        }
    }, [currentMonth, selectedAccount, accounts, fetchTransactions])

    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction)
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateTransaction(editingTransaction.id, data)
            setEditingTransaction(null)
            toast.success("Транзакция обновлена")
            fetchTransactions()
        } catch (error) {
            console.error('Ошибка при обновлении транзакции:', error)
            toast.error("Ошибка при обновлении транзакции")
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteTransaction(id)
            toast.success("Транзакция удалена")
            fetchTransactions()
        } catch (error) {
            console.error('Ошибка при удалении транзакции:', error)
            toast.error("Ошибка при удалении транзакции")
        }
    }

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

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24">
                    Загрузка транзакций...
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24 text-red-500">
                    {error}
                </div>
            </Card>
        )
    }

    if (!transactions.length) {
        return (
            <Card className="p-4">
                <div className="flex justify-center items-center h-24 text-gray-500">
                    Транзакции не найдены
                </div>
            </Card>
        )
    }
    return (
        <>
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
                                <div>{format(new Date(transaction.datetime), "dd.MM.yyyy", { locale: ru })}</div>
                                <div>{format(new Date(transaction.datetime), "HH:mm", { locale: ru })}</div>
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
                                    disabled={transaction.transaction_type_id === 3}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Удалить транзакцию?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Это действие нельзя отменить
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                                                Удалить
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <EditTransactionDialog
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                transaction={editingTransaction}
                onSubmit={handleUpdate}
                accounts={accounts}
                categories={categories}
            />
        </>
    )
}