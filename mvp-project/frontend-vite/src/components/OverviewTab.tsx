import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { FinancialSummary } from "@/components/FinancialSummary"
import { ExpensesByCategory } from "@/components/ExpensesByCategory"

interface OverviewTabProps {
    currentMonth: string;
    selectedAccount?: string;
    accounts: Array<{
        id: number;
        name: string;
    }>;
}

export function OverviewTab({ currentMonth, selectedAccount, accounts }: OverviewTabProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
                <FinancialSummary
                    currentMonth={currentMonth}
                    selectedAccount={selectedAccount}
                    accounts={accounts}
                />

                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>График расходов по категориям</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <CategoryPieChart
                            currentMonth={currentMonth}
                            selectedAccount={selectedAccount}
                            accounts={accounts}
                        />
                    </CardContent>
                </Card>
            </div>

            <ExpensesByCategory
                currentMonth={currentMonth}
                selectedAccount={selectedAccount}
                accounts={accounts}
            />
        </div>
    );
}