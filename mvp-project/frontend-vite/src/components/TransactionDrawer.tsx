import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer"
import { TransactionForm } from "./TransactionForm"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { useTransactions } from "@/hooks/useTransactions"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface TransactionData {
    account_id: number;
    category_id: number;
    transaction_type_id: number;
    amount: number;
    description: string;
    datetime: string;
}

export function TransactionDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const { accounts, isLoading: accountsLoading } = useAccounts()
    const { categories, isLoading: categoriesLoading } = useCategories()
    const { addTransaction } = useTransactions()

    const handleSubmit = async (data: TransactionData) => {
        try {
            await addTransaction(data)
            toast.success("Транзакция добавлена")
            setIsOpen(false)
        } catch (error) {
            console.error('Ошибка при сохранении транзакции:', error)
            toast.error("Ошибка при сохранении транзакции")
        }
    }

    if (accountsLoading || categoriesLoading) {
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
                        accounts={accounts || []}
                        categories={categories || []}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}