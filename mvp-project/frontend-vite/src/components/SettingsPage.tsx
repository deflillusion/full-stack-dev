import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccounts } from "@/hooks/useAccounts"
import { useCategories } from "@/hooks/useCategories"
import { useTransactionTypes } from "@/hooks/useTransactionTypes"
import { Pencil, Trash2, Plus, FileDown } from "lucide-react"
import { toast } from "sonner"
import { transactionsApi, accountsApi, categoriesApi } from "@/api"
import { AccountSelector } from "@/components/AccountSelector"
import { CategorySelector } from "@/components/CategorySelector"

type DialogState = {
  isOpen: boolean
  type: "account" | "category"
  mode: "create" | "edit"
  data?: { id: number; name: string; transaction_type_id?: number; balance?: number }
}

export function SettingsPage() {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: "account",
    mode: "create",
    data: undefined,
  })
  const [inputValue, setInputValue] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [transactionType, setTransactionType] = useState("")

  const {
    accounts,
    isLoading: accountsLoading,
    error: accountsError,
    fetchAccounts
  } = useAccounts()

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fetchCategories
  } = useCategories()

  const {
    types: transactionTypes,
    isLoading: typesLoading,
    error: typesError
  } = useTransactionTypes()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await fetchAccounts()
      await fetchCategories()
    } catch (error) {
      console.error("Ошибка при загрузке данных", error)
      toast.error("Ошибка при загрузке данных")
    }
  }

  const handleOpenDialog = (
    type: "account" | "category",
    mode: "create" | "edit",
    data?: DialogState["data"]
  ) => {
    setDialog({ isOpen: true, type, mode, data })
    if (mode === "edit" && data) {
      setInputValue(data.name)
      setTransactionType(data.transaction_type_id?.toString() || "")
      setInitialBalance(data.balance?.toString() || "")
    } else {
      setInputValue("")
      setTransactionType("1") // По умолчанию "Доход"
      setInitialBalance("")
    }
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, isOpen: false })
    setTimeout(() => {
      setInputValue("")
      setInitialBalance("")
      setTransactionType("")
    }, 200)
  }

  const handleSave = async () => {
    try {
      if (dialog.type === "account") {
        if (dialog.mode === "create") {
          await accountsApi.create({
            name: inputValue,
            balance: parseFloat(initialBalance || "0"),
          })
          toast.success(`Счет ${inputValue} создан`)
        } else if (dialog.mode === "edit" && dialog.data) {
          await accountsApi.update(dialog.data.id, {
            name: inputValue,
            balance: parseFloat(initialBalance || "0"),
          })
          toast.success(`Счет обновлен`)
        }
      } else {
        // Категория
        if (dialog.mode === "create") {
          await categoriesApi.create({
            name: inputValue,
            transaction_type_id: parseInt(transactionType),
          })
          toast.success(`Категория ${inputValue} создана`)
        } else if (dialog.mode === "edit" && dialog.data) {
          await categoriesApi.update(dialog.data.id, {
            name: inputValue,
            transaction_type_id: parseInt(transactionType),
          })
          toast.success(`Категория обновлена`)
        }
      }

      handleCloseDialog()
      loadData()
    } catch (error) {
      const errorMsg = `Ошибка при ${dialog.mode === "create" ? "создании" : "обновлении"} ${dialog.type === "account" ? "счета" : "категории"}`
      toast.error(errorMsg)
      console.error(errorMsg, error)
    }
  }

  const handleDelete = async (type: "account" | "category", id: number) => {
    try {
      if (type === "account") {
        await accountsApi.delete(id)
        toast.success("Счет удален")
      } else {
        await categoriesApi.delete(id)
        toast.success("Категория удалена")
      }
      loadData()
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status
        if (status === 400 || status === 409) {
          const message = err.response.data?.detail || `Невозможно удалить ${type === "account" ? "счет" : "категорию"}: объект используется`
          toast.error(message)
        } else {
          toast.error(`Ошибка при удалении: ${err.response.data?.detail || err.message}`)
        }
      } else {
        console.error("Unexpected error during deletion:", err)
        toast.error(`Произошла непредвиденная ошибка`)
      }
    }
  }

  if (accountsLoading || categoriesLoading || typesLoading) {
    return <div className="flex justify-center p-4">Загрузка...</div>
  }

  if (accountsError || categoriesError || typesError) {
    return <div className="text-red-500 p-4">Ошибка загрузки данных</div>
  }

  const getTransactionTypeName = (id: number) => {
    return transactionTypes?.find(t => t.id === id)?.name || "Неизвестный тип"
  }

  const getTransactionTypeColor = (id: number) => {
    switch (id) {
      case 1: return "text-green-500"  // Доход
      case 2: return "text-red-500"    // Расход
      case 3: return "text-blue-500"   // Перевод
      default: return "text-gray-500"
    }
  }

  const handleExportToExcel = () => {
    try {
      transactionsApi.exportToExcel()
      toast.success("Файл начал скачиваться")
    } catch (error) {
      toast.error("Ошибка при экспорте транзакций")
      console.error("Excel export error:", error)
    }
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Экспорт данных */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Экспорт данных</CardTitle>
            <CardDescription>Выгрузите данные для использования в других программах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={handleExportToExcel}
                className="w-full"
                variant="outline"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Экспорт всех транзакций в Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Счета */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Управление счетами</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => handleOpenDialog("account", "create")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить новый счет
              </Button>
              <ul className="space-y-2">
                {accounts.map((account) => (
                  <li key={account.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                    <div className="flex items-center space-x-2">
                      <span>{account.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog("account", "edit", account)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete("account", account.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
              <Button
                onClick={() => handleOpenDialog("category", "create")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить новую категорию
              </Button>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                    <div className="flex items-center space-x-2">
                      <span>{category.name}</span>
                      <span className={`text-sm ${getTransactionTypeColor(category.transaction_type_id)}`}>
                        ({getTransactionTypeName(category.transaction_type_id)})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog("category", "edit", category)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete("category", category.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialog.isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog.mode === "create" ? "Создать" : "Изменить"} {dialog.type === "account" ? "счет" : "категорию"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Название ${dialog.type === "account" ? "счета" : "категории"}`}
              autoFocus
            />
            {dialog.type === "account" ? (
              <Input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="Баланс"
                step="0.01"
              />
            ) : (
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
                disabled={dialog.mode === "edit"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes?.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id.toString()}
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}