"use client"

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
import dayjs from "dayjs"
import { TimePicker } from "./TimePicker"
import type { Account, Category } from "@/types/types"

interface TransactionFormProps {
    onSubmit: (data: {
        account_id: number;
        category_id: number;
        transaction_type_id: number;
        amount: number;
        description: string;
        datetime: string;
        to_account_id?: number;
    }) => Promise<void>;
    accounts: Account[];
    categories: Category[];
    initialData?: {
        id?: number;
        account_id: number;
        category_id: number;
        transaction_type_id: number;
        amount: number;
        description: string;
        datetime: string;
        to_account_id?: number;
    };
}

export function TransactionForm({ onSubmit, accounts, categories, initialData }: TransactionFormProps) {
    const [transactionType, setTransactionType] = useState(() =>
        initialData?.transaction_type_id || 1
    );
    const [accountId, setAccountId] = useState(() =>
        initialData?.account_id?.toString() || accounts[0]?.id.toString() || ""
    );
    const [toAccountId, setToAccountId] = useState(() =>
        initialData?.to_account_id?.toString() || ""
    );
    const [categoryId, setCategoryId] = useState(() =>
        initialData?.category_id?.toString() || ""
    );
    const [amount, setAmount] = useState(() => {
        if (!initialData) return "";

        const value = initialData.amount;
        return initialData.transaction_type_id === 2 ? (-value).toString() : value.toString();
    });
    const [description, setDescription] = useState(initialData?.description || "");
    const [date, setDate] = useState<Date>(() =>
        initialData?.datetime ? new Date(initialData.datetime) : new Date()
    );
    const [time, setTime] = useState(() =>
        initialData?.datetime ?
            dayjs(initialData.datetime).format("HH:mm") :
            dayjs().format("HH:mm")
    );
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accountId || !categoryId || !amount.trim()) {
            return;
        }

        let amountValue = parseFloat(amount);

        if (initialData && transactionType === 2) {
            amountValue = -amountValue;
        }

        try {
            await onSubmit({
                account_id: parseInt(accountId),
                category_id: parseInt(categoryId),
                transaction_type_id: transactionType,
                amount: amountValue, // Используем как есть при добавлении
                description,
                datetime: `${format(date, "yyyy-MM-dd")}T${time}:00`,
                to_account_id: transactionType === 3 ? parseInt(toAccountId) : undefined
            });

            if (!initialData) {
                setDescription("");
                setAmount("");
                setCategoryId("");
                setDate(new Date());
                setTime(dayjs().format("HH:mm"));
                setToAccountId("");
            }
        } catch (error) {
            console.error('Ошибка при сохранении транзакции:', error);
        }
    };

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate);
            setIsDateOpen(false);
        }
    };

    const handleTimeSelect = (newTime: string) => {
        setTime(newTime);
        setIsTimeOpen(false);
    };

    const categoriesForType = categories.filter(category =>
        category.transaction_type_id === Number(transactionType)
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Тип транзакции</Label>
                <div className="flex space-x-2">
                    <Button
                        type="button"
                        variant={transactionType === 1 ? "default" : "outline"}
                        className={cn(
                            "flex-1",
                            transactionType === 1
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setTransactionType(1)}
                    >
                        Доход
                    </Button>
                    <Button
                        type="button"
                        variant={transactionType === 2 ? "default" : "outline"}
                        className={cn(
                            "flex-1",
                            transactionType === 2
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setTransactionType(2)}
                    >
                        Расход
                    </Button>
                    <Button
                        type="button"
                        variant={transactionType === 3 ? "default" : "outline"}
                        className={cn(
                            "flex-1",
                            transactionType === 3
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setTransactionType(3)}
                    >
                        Перевод
                    </Button>
                </div>
            </div>

            <div>
                <Label htmlFor="account">Счет</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите счет" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                                {account.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {transactionType === 3 && (
                <div>
                    <Label htmlFor="toAccount">Счет для перевода</Label>
                    <Select value={toAccountId} onValueChange={setToAccountId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите счет для перевода" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div>
                <Label htmlFor="amount">Сумма</Label>
                <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    required
                />
            </div>

            <div>
                <Label htmlFor="category">Категория</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                        {categoriesForType.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="description">Описание</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <Label>Дата</Label>
                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(date, "dd.MM.yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex-1">
                    <Label>Время</Label>
                    <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {time}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <TimePicker
                                value={time}
                                onChange={handleTimeSelect}
                                onClose={() => setIsTimeOpen(false)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Button type="submit" className="w-full">
                {initialData ? "Сохранить изменения" : "Добавить транзакцию"}
            </Button>
        </form>
    );
}