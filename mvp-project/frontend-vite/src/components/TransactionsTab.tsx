import { TransactionList } from "@/components/TransactionList"
import type { Transaction } from "@/types/types"

interface TransactionsTabProps {
    currentMonth: string;
    selectedAccount: string;
    accounts: string[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
}

export function TransactionsTab({
    currentMonth,
    selectedAccount,
    accounts,
    onEdit,
    onDelete
}: TransactionsTabProps) {
    return (
        <TransactionList
            currentMonth={currentMonth}
            selectedAccount={selectedAccount}
            accounts={accounts}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}

