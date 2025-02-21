"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { TransactionForm } from "./TransactionForm"
import type { Transaction } from "../types/transaction"
import { Plus } from "lucide-react"

interface TransactionDrawerProps {
    onSubmit: (transaction: Omit<Transaction, "id">) => void
    accounts: string[]
}

export function TransactionDrawer({ onSubmit, accounts }: TransactionDrawerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = (transaction: Omit<Transaction, "id">) => {
        onSubmit(transaction)
        setIsOpen(false)
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button className="fixed bottom-20 md:bottom-4 right-4 rounded-full p-0 w-14 h-14 shadow-lg">
                    <Plus className="h-6 w-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Добавить транзакцию</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0">
                    <TransactionForm onSubmit={handleSubmit} accounts={accounts} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

