"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction, TransactionType, TransactionCategory } from "@/types/transaction"
import dayjs from "dayjs"

interface TransactionFormProps {
    onSubmit: (transaction: Omit<Transaction, "id">) => void
    initialData?: Transaction
}

export function TransactionForm({ onSubmit, initialData }: TransactionFormProps) {
    const [description, setDescription] = useState(initialData?.description || "")
    const [amount, setAmount] = useState(initialData?.amount.toString() || "")
    const [type, setType] = useState<TransactionType>(initialData?.type || "expense")
    const [category, setCategory] = useState<TransactionCategory>(initialData?.category || "other")
    const [date, setDate] = useState(initialData?.date || dayjs().format("YYYY-MM-DD"))
    const [toAccount, setToAccount] = useState(initialData?.toAccount || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            description,
            amount: Number.parseFloat(amount),
            type,
            category,
            date,
            toAccount: type === "transfer" ? toAccount : undefined,
        })
        if (!initialData) {
            setDescription("")
            setAmount("")
            setType("expense")
            setCategory("other")
            setDate(dayjs().format("YYYY-MM-DD"))
            setToAccount("")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="description">Описание</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="amount">Сумма</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <Label>Тип</Label>
                <div className="flex space-x-2 mt-1">
                    <Button type="button" variant={type === "expense" ? "default" : "outline"} onClick={() => setType("expense")}>
                        Расход
                    </Button>
                    <Button type="button" variant={type === "income" ? "default" : "outline"} onClick={() => setType("income")}>
                        Доход
                    </Button>
                    <Button
                        type="button"
                        variant={type === "transfer" ? "default" : "outline"}
                        onClick={() => setType("transfer")}
                    >
                        Перевод
                    </Button>
                </div>
            </div>
            <div>
                <Label htmlFor="category">Категория</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="food">Еда</SelectItem>
                        <SelectItem value="transport">Транспорт</SelectItem>
                        <SelectItem value="entertainment">Развлечения</SelectItem>
                        <SelectItem value="utilities">Коммунальные услуги</SelectItem>
                        <SelectItem value="salary">Зарплата</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {type === "transfer" && (
                <div>
                    <Label htmlFor="toAccount">Счет назначения</Label>
                    <Input
                        id="toAccount"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        required={type === "transfer"}
                    />
                </div>
            )}
            <div>
                <Label htmlFor="date">Дата</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <Button type="submit">{initialData ? "Обновить" : "Добавить"} транзакцию</Button>
        </form>
    )
}

