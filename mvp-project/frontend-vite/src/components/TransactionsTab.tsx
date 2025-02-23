import { TransactionList } from "@/components/TransactionList"
import type { Transaction } from "@/types/types"

interface TransactionsTabProps {
    transactions: Transaction[]
    onEdit: (transaction: Transaction) => void
    onDelete: (id: number) => void
}

export function TransactionsTab({ transactions, onEdit, onDelete }: TransactionsTabProps) {
    return (
        <div className="max-w-2xl mx-auto">
            <TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
        </div>
    )
}

