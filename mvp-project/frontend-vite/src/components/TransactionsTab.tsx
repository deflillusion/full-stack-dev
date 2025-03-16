import { TransactionList } from "@/components/TransactionList"
import type { Account, Transaction } from "@/types/types"

interface TransactionsTabProps {
    currentMonth: string;
    selectedAccount: string;
    accounts: Account[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
    refreshTrigger?: number;
}

export function TransactionsTab({
    currentMonth,
    selectedAccount,
    accounts,
    onEdit,
    onDelete,
    refreshTrigger
}: TransactionsTabProps) {
    return (
        <TransactionList
            currentMonth={currentMonth}
            selectedAccount={selectedAccount}
            refreshTrigger={refreshTrigger}
        />
    );
}

