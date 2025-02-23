"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Transaction, TransactionType, TransactionCategory } from "@/types/types"
import dayjs from "dayjs"
import { TimePicker } from "./TimePicker"

interface TransactionFormProps {
    onSubmit: (transaction: Omit<Transaction, "id">) => void
    initialData?: Transaction
    accounts: string[]
}

export function TransactionForm({ onSubmit, initialData, accounts }: TransactionFormProps) {
    const [account, setAccount] = useState(initialData?.toAccount || (accounts && accounts.length > 0 ? accounts[0] : ""))
    const [description, setDescription] = useState(initialData?.description || "")
    const [amount, setAmount] = useState(initialData?.amount.toString() || "")
    const [type, setType] = useState<TransactionType>(initialData?.type || "expense")
    const [category, setCategory] = useState<TransactionCategory>(initialData?.category || "other")
    const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : new Date())
    const [time, setTime] = useState(initialData?.time || dayjs().format("HH:mm"))
    const [toAccount, setToAccount] = useState(initialData?.toAccount || "")
    const [isDateOpen, setIsDateOpen] = useState(false)
    const [isTimeOpen, setIsTimeOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            description,
            amount: Number.parseFloat(amount),
            type,
            category,
            date: date ? format(date, "yyyy-MM-dd") : dayjs().format("YYYY-MM-DD"),
            time,
            toAccount: type === "transfer" ? toAccount : account,
        })
        if (!initialData) {
            setDescription("")
            setAmount("")
            setType("expense")
            setCategory("other")
            setDate(new Date())
            setTime(dayjs().format("HH:mm"))
            setToAccount("")
        }
    }

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate)
        setIsDateOpen(false)
    }

    const handleTimeSelect = (newTime: string) => {
        setTime(newTime)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="account">Счет</Label>
                <Select value={account} onValueChange={setAccount}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts && accounts.length > 0 ? (
                            accounts.map((acc) => (
                                <SelectItem key={acc} value={acc}>
                                    {acc}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-accounts">No accounts available</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
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
                    <Select value={toAccount} onValueChange={setToAccount}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите счет назначения" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts && accounts.length > 0 ? (
                                accounts
                                    .filter((acc) => acc !== account)
                                    .map((acc) => (
                                        <SelectItem key={acc} value={acc}>
                                            {acc}
                                        </SelectItem>
                                    ))
                            ) : (
                                <SelectItem value="no-other-accounts">No other accounts available</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <Label htmlFor="date">Дата</Label>
                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Выберите дату</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex-1">
                    <Label htmlFor="time">Время</Label>
                    <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !time && "text-muted-foreground")}
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {time || <span>Выберите время</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <TimePicker value={time} onChange={handleTimeSelect} onClose={() => setIsTimeOpen(false)} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Button type="submit">{initialData ? "Обновить" : "Добавить"} транзакцию</Button>
        </form>
    )
}

