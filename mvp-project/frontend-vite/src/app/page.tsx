// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { TransactionForm } from "../components/TransactionForm"
// import { TransactionList } from "../components/TransactionList"
// import { TransactionChart } from "../components/TransactionChart"
// import type { Transaction } from "../types/transaction"
// import { saveTransactions, getTransactions } from "../utils/localStorage"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export default function ExpenseTracker() {
//     const [transactions, setTransactions] = useState<Transaction[]>([])
//     const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
//     const [filter, setFilter] = useState({ type: "all", category: "all", startDate: "", endDate: "" })

//     useEffect(() => {
//         setTransactions(getTransactions())
//     }, [])

//     useEffect(() => {
//         saveTransactions(transactions)
//     }, [transactions])

//     const addTransaction = (newTransaction: Omit<Transaction, "id">) => {
//         setTransactions([...transactions, { ...newTransaction, id: Date.now() }])
//     }

//     const updateTransaction = (updatedTransaction: Transaction) => {
//         setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
//         setEditingTransaction(null)
//     }

//     const deleteTransaction = (id: number) => {
//         setTransactions(transactions.filter((t) => t.id !== id))
//     }

//     const filteredTransactions = transactions.filter(
//         (t) =>
//             (filter.type === "all" || t.type === filter.type) &&
//             (filter.category === "all" || t.category === filter.category) &&
//             (!filter.startDate || t.date >= filter.startDate) &&
//             (!filter.endDate || t.date <= filter.endDate),
//     )

//     const balance = filteredTransactions.reduce((acc, t) => {
//         if (t.type === "income") return acc + t.amount
//         if (t.type === "expense") return acc - t.amount
//         return acc // для переводов баланс не меняется
//     }, 0)

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>{editingTransaction ? "Редактировать транзакцию" : "Добавить новую транзакцию"}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <TransactionForm
//                         onSubmit={editingTransaction ? updateTransaction : addTransaction}
//                         initialData={editingTransaction || undefined}
//                     />
//                 </CardContent>
//             </Card>

//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>Фильтры</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-2 gap-4">
//                     <div>
//                         <Label htmlFor="type-filter">Тип</Label>
//                         <Select value={filter.type} onValueChange={(value) => setFilter({ ...filter, type: value })}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Выберите тип" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">Все</SelectItem>
//                                 <SelectItem value="income">Доходы</SelectItem>
//                                 <SelectItem value="expense">Расходы</SelectItem>
//                                 <SelectItem value="transfer">Переводы</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label htmlFor="category-filter">Категория</Label>
//                         <Select value={filter.category} onValueChange={(value) => setFilter({ ...filter, category: value })}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Выберите категорию" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">Все</SelectItem>
//                                 <SelectItem value="food">Еда</SelectItem>
//                                 <SelectItem value="transport">Транспорт</SelectItem>
//                                 <SelectItem value="entertainment">Развлечения</SelectItem>
//                                 <SelectItem value="utilities">Коммунальные услуги</SelectItem>
//                                 <SelectItem value="salary">Зарплата</SelectItem>
//                                 <SelectItem value="other">Другое</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label htmlFor="start-date">Начальная дата</Label>
//                         <Input
//                             id="start-date"
//                             type="date"
//                             value={filter.startDate}
//                             onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="end-date">Конечная дата</Label>
//                         <Input
//                             id="end-date"
//                             type="date"
//                             value={filter.endDate}
//                             onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
//                         />
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>Баланс: {balance.toFixed(2)}</CardTitle>
//                     <CardDescription>График доходов и расходов</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <TransactionChart transactions={filteredTransactions} />
//                 </CardContent>
//             </Card>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Список транзакций</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <TransactionList
//                         transactions={filteredTransactions}
//                         onEdit={setEditingTransaction}
//                         onDelete={deleteTransaction}
//                     />
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

