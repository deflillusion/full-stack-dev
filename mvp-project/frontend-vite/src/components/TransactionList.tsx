import type { Transaction } from "../types/transaction"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dayjs from "dayjs"

interface TransactionListProps {
    transactions: Transaction[]
    onEdit: (transaction: Transaction) => void
    onDelete: (id: number) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
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

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col p-4 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{transaction.description}</span>
                        <div className="flex items-center space-x-2">
                            <Badge variant={getTransactionTypeBadgeVariant(transaction.type)}>
                                {getTransactionTypeLabel(transaction.type)}
                            </Badge>
                            <span
                                className={
                                    transaction.type === "income"
                                        ? "text-green-500"
                                        : transaction.type === "expense"
                                            ? "text-red-500"
                                            : "text-blue-500"
                                }
                            >
                                {transaction.amount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                        {dayjs(`${transaction.date} ${transaction.time}`).format("DD.MM.YYYY HH:mm")} • {transaction.category}
                        {transaction.type === "transfer" && ` • ${transaction.toAccount}`}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                            Изменить
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>
                            Удалить
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

