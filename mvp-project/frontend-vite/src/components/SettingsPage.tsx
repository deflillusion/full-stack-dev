import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCategories } from "@/hooks/useCategories"
import { useAccounts } from "@/hooks/useAccounts"
import { toast } from "sonner"

export function SettingsPage() {
  const [newCategory, setNewCategory] = useState("")
  const [newAccount, setNewAccount] = useState("")
  const [editingCategory, setEditingCategory] = useState<{ id: number, name: string } | null>(null)
  const [editingAccount, setEditingAccount] = useState<{ id: number, name: string } | null>(null)

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories()

  const {
    accounts,
    isLoading: accountsLoading,
    error: accountsError,
    refetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount
  } = useAccounts()

  // Загружаем данные только при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), refetchAccounts()])
    }
    loadData()
  }, []) // Убрали зависимости

  const handleAddAccount = async () => {
    if (!newAccount.trim()) return
    try {
      await addAccount({ name: newAccount, balance: 0 })
      setNewAccount("")
      toast.success("Счет успешно добавлен")
    } catch (err) {
      toast.error("Не удалось добавить счет")
    }
  }

  const handleEditAccount = async (id: number, newName: string) => {
    try {
      await updateAccount(id, { name: newName })
      setEditingAccount(null)
      toast.success("Счет успешно обновлен")
    } catch (err) {
      toast.error("Ошибка при обновлении счета")
    }
  }

  const handleDeleteAccount = async (id: number) => {
    try {
      await deleteAccount(id)
      toast.success("Счет успешно удален")
    } catch (err) {
      toast.error("Ошибка при удалении счета")
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    try {
      await addCategory(newCategory)
      setNewCategory("")
      toast.success("Категория успешно добавлена")
    } catch (err) {
      toast.error("Не удалось добавить категорию")
    }
  }

  const handleEditCategory = async (id: number, newName: string) => {
    try {
      await updateCategory(id, newName)
      setEditingCategory(null)
      toast.success("Категория успешно обновлена")
    } catch (err) {
      toast.error("Ошибка при обновлении категории")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id)
      toast.success("Категория успешно удалена")
    } catch (err) {
      toast.error("Ошибка при удалении категории")
    }
  }

  if (categoriesLoading || accountsLoading) {
    return <div className="flex justify-center p-4">Загрузка...</div>
  }

  if (categoriesError || accountsError) {
    return <div className="text-red-500 p-4">Ошибка загрузки данных</div>
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Счета */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Управление счетами</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  placeholder="Новый счет"
                />
                <Button onClick={handleAddAccount}>Добавить</Button>
              </div>
              <ul className="space-y-2">
                {accounts.map((account) => (
                  <li key={account.id} className="flex items-center justify-between">
                    {editingAccount?.id === account.id ? (
                      <Input
                        value={editingAccount.name}
                        onChange={(e) => setEditingAccount({
                          ...editingAccount,
                          name: e.target.value
                        })}
                        onBlur={() => handleEditAccount(account.id, editingAccount.name)}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{account.name}</span>
                        <span className="text-sm text-gray-500">
                          ({account.balance.toFixed(2)} ₽)
                        </span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAccount(account)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Категории */}
        <Card className="w-full">
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
                  <li key={category.id} className="flex items-center justify-between">
                    {editingCategory?.id === category.id ? (
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          name: e.target.value
                        })}
                        onBlur={() => handleEditCategory(category.id, editingCategory.name)}
                      />
                    ) : (
                      <span>{category.name}</span>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
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
    </div >
  )
}