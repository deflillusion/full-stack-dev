import type { Transaction } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
                <Card key={transaction.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="font-semibold mb-1">{transaction.description}</div>
                            <div className="text-sm text-gray-500">
                                {dayjs(`${transaction.date} ${transaction.time}`).format("DD.MM.YYYY HH:mm")} • {transaction.category}
                                {transaction.type === "transfer" && ` • ${transaction.toAccount}`}
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
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
                    <div className="flex justify-end space-x-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                            Изменить
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>
                            Удалить
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}

