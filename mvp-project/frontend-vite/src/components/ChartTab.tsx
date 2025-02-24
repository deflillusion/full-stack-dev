import { Card, CardContent } from "@/components/ui/card"
import { TransactionChart } from "@/components/TransactionChart"
import type { Transaction } from "@/types/types"

interface ChartTabProps {
    currentMonth: string;
    selectedAccount: string;
    accounts: Array<{
        id: number;
        name: string;
    }>;
}

export function ChartTab({
    currentMonth,
    selectedAccount,
    accounts
}: ChartTabProps) {
    return (
        <TransactionChart
            currentMonth={currentMonth}
            selectedAccount={selectedAccount}
            accounts={accounts}
        />
    );
}

