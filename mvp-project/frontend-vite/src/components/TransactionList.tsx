import { useState, useEffect, useCallback } from "react"
import dayjs from "dayjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/hooks/useTransactions"
import { useCategories } from "@/hooks/useCategories"
import { Pencil, Trash2 } from "lucide-react"
import { useAccounts } from "@/hooks/useAccounts"
import { Transaction as TransactionType, Account, Category } from "@/types/types"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { EditTransactionDialog } from "./EditTransactionDialog"
import { toast } from "sonner"
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
    selectedCategory?: string
    currentMonth: string
    refreshTrigger?: number
}

export function TransactionList({ selectedAccount, selectedCategory, currentMonth, refreshTrigger = 0 }: TransactionListProps) {
    const [editingTransaction, setEditingTransaction] = useState<any>(null)
    const { accounts } = useAccounts()
    const { categories } = useCategories()

    // Получаем ID категории из её имени
    const category_id = selectedCategory && selectedCategory !== "Все категории"
        ? categories?.find(c => c.name === selectedCategory)?.id
        : undefined;

    const { transactions, isLoading, error, fetchTransactions, deleteTransaction, updateTransaction } = useTransactions(
        selectedAccount ? parseInt(selectedAccount) : undefined,
        currentMonth,
        category_id
    )

    // Обновляем список при изменении refreshTrigger, выбранной категории или счета
    useEffect(() => {
        console.log("useEffect для fetchTransactions, изменились:", { refreshTrigger, selectedAccount, selectedCategory, category_id });
        fetchTransactions();
    }, [refreshTrigger, fetchTransactions, selectedCategory, selectedAccount, category_id]);

    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction)
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateTransaction(editingTransaction.id, data)
            setEditingTransaction(null)
            toast.success("Транзакция обновлена")
        } catch (error) {
            console.error('Ошибка при обновлении транзакции:', error)
            toast.error("Ошибка при обновлении транзакции")
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteTransaction(id)
            toast.success("Транзакция удалена")
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
                        <div className="flex min-h-[80px]">
                            {/* Левая часть */}
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="font-medium break-words">
                                    {categories?.find(c => c.id === transaction.category_id)?.name || 'Неизвестная категория'}
                                </div>
                                {transaction.description && (
                                    <div className="text-muted-foreground break-words">
                                        {transaction.description}
                                    </div>
                                )}
                                <div className="text-muted-foreground break-words">
                                    {accounts?.find(a => a.id === transaction.account_id)?.name || 'Неизвестный счет'}
                                </div>
                                {/* Дата и время для мобильной версии */}
                                <div className="text-muted-foreground break-words md:hidden">
                                    {format(new Date(transaction.datetime), "dd.MM.yyyy HH:mm", { locale: ru })}
                                </div>
                            </div>

                            {/* Центральная часть - дата и время (только для десктопа) */}
                            <div className="mx-4 text-right text-muted-foreground shrink-0 hidden md:block">
                                <div>{format(new Date(transaction.datetime), "dd.MM.yyyy", { locale: ru })}</div>
                                <div>{format(new Date(transaction.datetime), "HH:mm", { locale: ru })}</div>
                            </div>

                            {/* Средняя часть справа - тип и сумма */}
                            <div className="flex flex-col items-end justify-between mr-4 shrink-0">
                                <Badge variant={getTransactionTypeBadgeVariant(transaction.transaction_type_id)}>
                                    {getTransactionTypeLabel(transaction.transaction_type_id)}
                                </Badge>
                                <span className={`text-lg font-semibold ${transaction.transaction_type_id === 1
                                    ? "text-green-500"
                                    : transaction.transaction_type_id === 2
                                        ? "text-red-500"
                                        : "text-blue-500"
                                    }`}>
                                    {new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(transaction.amount)}
                                </span>
                            </div>

                            {/* Правая часть - кнопки действий */}
                            <div className="flex flex-col justify-center space-y-2 ml-4 border-l border-border pl-4 h-full">
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