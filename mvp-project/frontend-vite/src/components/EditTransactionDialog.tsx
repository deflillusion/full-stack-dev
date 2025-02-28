import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { TransactionForm } from "./TransactionForm"
import type { Account, Category, Transaction } from "@/types/types"

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
    const handleSubmit = async (data: Transaction) => {
        if (transaction) {
            await onSubmit({ ...data, id: transaction.id });
            onClose();
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