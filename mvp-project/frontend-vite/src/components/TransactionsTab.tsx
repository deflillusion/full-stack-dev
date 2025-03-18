import { useState } from "react";
import { TransactionList } from "@/components/TransactionList"
import { CategorySelector } from "@/components/CategorySelector"
import { useCategories } from "@/hooks/useCategories"
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
    const [selectedCategory, setSelectedCategory] = useState("Все категории");
    const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

    return (
        <div>
            <div className="flex justify-end mb-4">
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    isLoading={isLoadingCategories}
                    error={categoriesError}
                    align="end"
                />
            </div>
            <TransactionList
                currentMonth={currentMonth}
                selectedAccount={selectedAccount}
                selectedCategory={selectedCategory}
                refreshTrigger={refreshTrigger}
            />
        </div>
    );
}

