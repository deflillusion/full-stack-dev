import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CategorySelector } from "@/components/CategorySelector";
import { YearlyChart } from "@/components/YearlyChart";
import { TransactionChart } from "@/components/TransactionChart";

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
    const [selectedCategory, setSelectedCategory] = useState("Все категории");
    const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

    // Получаем ID выбранной категории
    const categoryId = selectedCategory !== "Все категории" && categories
        ? categories.find(c => c.name === selectedCategory)?.id
        : undefined;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    isLoading={categoriesLoading}
                    error={categoriesError}
                    align="end"
                />
            </div>

            <div className="grid gap-4">
                <TransactionChart
                    currentMonth={currentMonth}
                    selectedAccount={selectedAccount}
                    selectedCategory={selectedCategory}
                    categoryId={categoryId}
                    accounts={accounts}
                />

                <YearlyChart
                    currentMonth={currentMonth}
                    selectedAccount={selectedAccount}
                    selectedCategory={selectedCategory}
                    categoryId={categoryId}
                    accounts={accounts}
                />
            </div>
        </div>
    );
}

