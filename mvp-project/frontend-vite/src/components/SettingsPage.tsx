import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/hooks/useCategories"
import { useAccounts } from "@/hooks/useAccounts"
import { useTransactionTypes } from "@/hooks/useTransactionTypes"
import { Pencil, Trash2, Plus, FileDown, Download } from "lucide-react"
import { toast } from "sonner"
import { transactionsApi } from "@/api"

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
    mode: "create"
  })
  const [inputValue, setInputValue] = useState("")
  const [initialBalance, setInitialBalance] = useState("0")
  const [transactionType, setTransactionType] = useState("1")

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
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount
  } = useAccounts()

  const {
    types: transactionTypes,
    isLoading: typesLoading,
    error: typesError
  } = useTransactionTypes()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchAccounts()])
    }
    loadData()
  }, [fetchCategories, fetchAccounts])

  const handleOpenDialog = (
    type: "account" | "category",
    mode: "create" | "edit",
    data?: DialogState["data"]
  ) => {
    setDialog({ isOpen: true, type, mode, data })
    setInputValue(data?.name || "")
    setTransactionType(data?.transaction_type_id?.toString() || "1")
    if (type === "account") {
      setInitialBalance(data?.balance?.toString() || "0")
    }
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, isOpen: false })
    setInputValue("")
    setInitialBalance("0")
    setTransactionType("1")
  }

  const handleSave = async () => {
    if (!inputValue.trim()) {
      toast.error("Введите название")
      return
    }

    try {
      if (dialog.type === "account") {
        const balance = parseFloat(initialBalance)
        if (isNaN(balance)) {
          toast.error("Введите корректный баланс")
          return
        }

        if (dialog.mode === "create") {
          await addAccount({ name: inputValue, balance })
          toast.success("Счет успешно добавлен")
        } else if (dialog.data?.id) {
          await updateAccount(dialog.data.id, { name: inputValue, balance })
          toast.success("Счет успешно обновлен")
        }
      } else {
        const transaction_type_id = parseInt(transactionType)
        if (dialog.mode === "create") {
          await addCategory({ name: inputValue, transaction_type_id })
          toast.success("Категория успешно добавлена")
        } else if (dialog.data?.id) {
          await updateCategory(dialog.data.id, { name: inputValue, transaction_type_id })
          toast.success("Категория успешно обновлена")
        }
      }
      handleCloseDialog()
    } catch (err) {
      toast.error(`Ошибка при ${dialog.mode === "create" ? "создании" : "обновлении"}`)
    }
  }

  const handleDelete = async (type: "account" | "category", id: number) => {
    try {
      if (type === "account") {
        await deleteAccount(id)
        toast.success("Счет успешно удален")
      } else {
        await deleteCategory(id)
        toast.success("Категория успешно удалена")
      }
    } catch (err) {
      toast.error(`Ошибка при удалении`)
    }
  }

  if (categoriesLoading || accountsLoading || typesLoading) {
    return <div className="flex justify-center p-4">Загрузка...</div>
  }

  if (categoriesError || accountsError || typesError) {
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
      transactionsApi.exportToExcel();
      toast.success("Файл начал скачиваться");
    } catch (error) {
      toast.error("Ошибка при экспорте транзакций");
      console.error("Excel export error:", error);
    }
  };

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
              {dialog.mode === "create" ? "Создать" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}