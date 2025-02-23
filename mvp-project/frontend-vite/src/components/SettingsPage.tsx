"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransactionCategory } from "@/types/types"

interface SettingsPageProps {
  categories: TransactionCategory[]
  accounts: string[]
  onAddCategory: (category: string) => void
  onEditCategory: (oldCategory: string, newCategory: string) => void
  onDeleteCategory: (category: string) => void
  onAddAccount: (account: string) => void
  onEditAccount: (oldAccount: string, newAccount: string) => void
  onDeleteAccount: (account: string) => void
}

export function SettingsPage({
  categories,
  accounts,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
}: SettingsPageProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newAccount, setNewAccount] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)

  const handleAddCategory = () => {
    if (newCategory) {
      onAddCategory(newCategory)
      setNewCategory("")
    }
  }

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    onEditCategory(oldCategory, newCategory)
    setEditingCategory(null)
  }

  const handleAddAccount = () => {
    if (newAccount) {
      onAddAccount(newAccount)
      setNewAccount("")
    }
  }

  const handleEditAccount = (oldAccount: string, newAccount: string) => {
    onEditAccount(oldAccount, newAccount)
    setEditingAccount(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление категориями</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Новая категория"
              />
              <Button onClick={handleAddCategory}>Добавить</Button>
            </div>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category} className="flex items-center justify-between">
                  {editingCategory === category ? (
                    <Input
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                      onBlur={() => handleEditCategory(category, editingCategory)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditCategory(category, editingCategory)}
                    />
                  ) : (
                    <span>{category}</span>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        editingCategory === category
                          ? handleEditCategory(category, editingCategory)
                          : setEditingCategory(category)
                      }
                    >
                      {editingCategory === category ? "Сохранить" : "Изменить"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteCategory(category)}>
                      Удалить
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление счетами</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input value={newAccount} onChange={(e) => setNewAccount(e.target.value)} placeholder="Новый счет" />
              <Button onClick={handleAddAccount}>Добавить</Button>
            </div>
            <ul className="space-y-2">
              {accounts.map((account) => (
                <li key={account} className="flex items-center justify-between">
                  {editingAccount === account ? (
                    <Input
                      value={editingAccount}
                      onChange={(e) => setEditingAccount(e.target.value)}
                      onBlur={() => handleEditAccount(account, editingAccount)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditAccount(account, editingAccount)}
                    />
                  ) : (
                    <span>{account}</span>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        editingAccount === account
                          ? handleEditAccount(account, editingAccount)
                          : setEditingAccount(account)
                      }
                    >
                      {editingAccount === account ? "Сохранить" : "Изменить"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteAccount(account)}>
                      Удалить
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

