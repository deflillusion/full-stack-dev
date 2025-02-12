import type { Transaction } from "@/types/transaction"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dayjs from "dayjs"

interface TransactionListProps {
    transactions: Transaction[]
    onEdit: (transaction: Transaction) => void
    onDelete: (id: number) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell>{dayjs(transaction.date).format("DD.MM.YYYY")}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell
                            className={
                                transaction.type === "income"
                                    ? "text-green-500"
                                    : transaction.type === "expense"
                                        ? "text-red-500"
                                        : "text-blue-500"
                            }
                        >
                            {transaction.type === "income" && "+"}
                            {transaction.type === "expense" && "-"}
                            {transaction.amount.toFixed(2)}
                            {transaction.type === "transfer" && ` (${transaction.toAccount})`}
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" onClick={() => onEdit(transaction)} className="mr-2">
                                Редактировать
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>
                                Удалить
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

