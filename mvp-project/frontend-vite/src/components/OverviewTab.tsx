import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { FinancialSummary } from "@/components/FinancialSummary"
import { ExpensesByCategory } from "@/components/ExpensesByCategory"
import type { Transaction } from "@/types/types"

interface OverviewTabProps {
    transactions: Transaction[]
    currentMonth: string
}

export function OverviewTab({ transactions, currentMonth }: OverviewTabProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
                <FinancialSummary transactions={transactions} currentMonth={currentMonth} />

                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>График расходов по категориям</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryPieChart transactions={transactions} type="expense" />
                    </CardContent>
                </Card>
            </div>

            <ExpensesByCategory transactions={transactions} />
        </div>
    )
}

