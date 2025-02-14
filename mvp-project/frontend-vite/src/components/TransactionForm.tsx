"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction, TransactionType } from "../types/transaction"
import type { Account } from "../types/account"
import type { Category } from "../types/category"
import dayjs from "dayjs"

interface TransactionFormProps {
    onSubmit: (transaction: Omit<Transaction, "id">) => void
    initialData?: Transaction
}

export function TransactionForm({ onSubmit, initialData }: TransactionFormProps) {
    const [description, setDescription] = useState(initialData?.description || "")
    const [amount, setAmount] = useState(initialData?.amount.toString() || "")
    const [type, setType] = useState<TransactionType>(initialData?.type || "expense")
    const [category, setCategory] = useState(initialData?.category || "")
    const [date, setDate] = useState(initialData?.date || dayjs().format("YYYY-MM-DD"))
    const [fromAccount, setFromAccount] = useState(initialData?.fromAccount || "")
    const [toAccount, setToAccount] = useState(initialData?.toAccount || "")
    const [accounts, setAccounts] = useState<Account[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const savedAccounts = localStorage.getItem("accounts")
        const savedCategories = localStorage.getItem("categories")
        if (savedAccounts) {
            setAccounts(JSON.parse(savedAccounts))
        }
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            description,
            amount: Number.parseFloat(amount),
            type,
            category,
            date,
            fromAccount,
            toAccount: type === "transfer" ? toAccount : undefined,
        })
        if (!initialData) {
            setDescription("")
            setAmount("")
            setType("expense")
            setCategory("")
            setDate(dayjs().format("YYYY-MM-DD"))
            setFromAccount("")
            setToAccount("")
        }
    }

    const filteredCategories = categories.filter((cat) => cat.type === "both" || cat.type === type)

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
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="fromAccount">Счет списания</Label>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                                {account.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {type === "transfer" && (
                <div>
                    <Label htmlFor="toAccount">Счет назначения</Label>
                    <Select value={toAccount} onValueChange={setToAccount}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите счет" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

