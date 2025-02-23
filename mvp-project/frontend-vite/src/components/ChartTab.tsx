import { Card, CardContent } from "@/components/ui/card"
import { TransactionChart } from "@/components/TransactionChart"
import type { Transaction } from "@/types/types"

interface ChartTabProps {
    transactions: Transaction[]
}

export function ChartTab({ transactions }: ChartTabProps) {
    return (
        <Card>
            <CardContent>
                <TransactionChart transactions={transactions} />
            </CardContent>
        </Card>
    )
}

