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
    fetchTransactions: () => Promise<any>;
}

export function TransactionDrawer({
    accounts,
    fetchTransactions
}: TransactionDrawerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { categories, isLoading: categoriesLoading } = useCategories()
    const { addTransaction } = useTransactions() // Используем хук для добавления транзакции

    const handleSubmit = async (data: Omit<Transaction, 'id' | 'user_id'>) => {
        try {
            await addTransaction({
                ...data,
                id: 0,
                user_id: 0
            } as Transaction);

            toast.success("Транзакция добавлена");
            setIsOpen(false);

            // Обновляем список транзакций
            await fetchTransactions();
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