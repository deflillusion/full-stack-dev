import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer"
import { TransactionForm } from "./TransactionForm"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { useTransactions } from "@/hooks/useTransactions" // Добавлен импорт
import { Plus } from "lucide-react"
import { toast } from "sonner"
import type { Transaction, Account } from "@/types/types"

interface TransactionDrawerProps {
    accounts: Account[];
    // Убираем fetchTransactions из пропсов, так как он больше не нужен
}

export function TransactionDrawer({
    accounts,
}: TransactionDrawerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { categories, isLoading: categoriesLoading } = useCategories()
    const { addTransaction } = useTransactions() // Используем хук для добавления транзакции

    const handleSubmit = async (data: any) => {
        try {
            // Добавляем недостающие поля для соответствия типу Transaction
            await addTransaction({
                ...data,
                id: 0,
                user_id: 0,
                type: data.transaction_type_id === 1 ? 'income' :
                    data.transaction_type_id === 2 ? 'expense' : 'transfer'
            } as Transaction);

            toast.success("Транзакция добавлена");
            setIsOpen(false);
        } catch (error) {
            console.error("Ошибка при сохранении транзакции:", error);
            toast.error("Ошибка при сохранении транзакции");
        }
    }

    if (categoriesLoading) {
        return null;
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    className="fixed bottom-20 md:bottom-4 right-4 rounded-full p-0 w-14 h-14 shadow-lg z-50"
                    disabled={!accounts?.length || !categories?.length}
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Добавить транзакцию</DrawerTitle>
                    <DrawerDescription>
                        Заполните форму для добавления новой транзакции
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <TransactionForm
                        onSubmit={handleSubmit}
                        accounts={accounts}
                        categories={categories || []}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}