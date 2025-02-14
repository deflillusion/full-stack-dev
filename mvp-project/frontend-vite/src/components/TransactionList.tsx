import type { Transaction } from "../types/transaction"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"

interface TransactionListProps {
    transactions: Transaction[]
    onEdit: (transaction: Transaction) => void
    onDelete: (id: number) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col p-4 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{transaction.description}</span>
                        <span
                            className={
                                transaction.type === "income"
                                    ? "text-green-500"
                                    : transaction.type === "expense"
                                        ? "text-red-500"
                                        : "text-blue-500"
                            }
                        >
                            {transaction.type === "income" && "+"}
                            {transaction.type === "expense" && "-"}
                            {transaction.amount.toFixed(2)}
                            {transaction.type === "transfer" && ` (${transaction.toAccount})`}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                        {dayjs(transaction.date).format("DD.MM.YYYY")} • {transaction.category}
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

