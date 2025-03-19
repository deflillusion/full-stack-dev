import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { TransactionForm } from "./TransactionForm"
import type { Account, Category, Transaction } from "@/types/types"
import { toast } from "sonner"

interface EditTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onSubmit: (data: Transaction) => Promise<void>;
    accounts: Account[];
    categories: Category[];
}

export function EditTransactionDialog({
    isOpen,
    onClose,
    transaction,
    onSubmit,
    accounts,
    categories
}: EditTransactionDialogProps) {
    const handleSubmit = async (data: {
        account_id: number;
        category_id: number;
        transaction_type_id: number;
        amount: number;
        description: string;
        datetime: string;
        to_account_id?: number;
    }) => {
        try {
            if (transaction) {
                await onSubmit({ ...data, id: transaction.id });
                onClose();
                toast.success("Транзакция успешно обновлена");
            }
        } catch (error) {
            console.error("Ошибка при обновлении транзакции:", error);
            toast.error("Не удалось обновить транзакцию");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать транзакцию</DialogTitle>
                    <DialogDescription>
                        Измените данные транзакции и сохраните изменения.
                    </DialogDescription>
                </DialogHeader>
                {transaction && (
                    <TransactionForm
                        onSubmit={handleSubmit}
                        accounts={accounts}
                        categories={categories}
                        initialData={transaction}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}