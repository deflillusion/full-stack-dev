import { TransactionList } from "@/components/TransactionList"
import type { Account, Transaction } from "@/types/types"
import internal from "stream";

interface TransactionsTabProps {
    currentMonth: string;
    selectedAccount: string;
    accounts: Account[];
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

