"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Category } from "../types/category"

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([
        { id: uuidv4(), name: "Продукты", type: "expense" },
        { id: uuidv4(), name: "Транспорт", type: "expense" },
        { id: uuidv4(), name: "Зарплата", type: "income" },
    ]);

    const [newCategoryName, setNewCategoryName] = useState("")
    const [newCategoryType, setNewCategoryType] = useState<"income" | "expense" | "both">("both")

    useEffect(() => {
        const savedCategories = localStorage.getItem("categories")
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    const addCategory = () => {
        if (newCategoryName) {
            const newCategory: Category = {
                id: uuidv4(),
                name: newCategoryName,
                type: newCategoryType,
            }
            setCategories([...categories, newCategory])
            setNewCategoryName("")
            setNewCategoryType("both")
        }
    }

    const deleteCategory = (id: string) => {
        setCategories(categories.filter((category) => category.id !== id))
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Управление категориями</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Добавить новую категорию</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="categoryName">Название категории</Label>
                            <Input
                                id="categoryName"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Введите название категории"
                            />
                        </div>
                        <div>
                            <Label htmlFor="categoryType">Тип категории</Label>
                            <Select
                                value={newCategoryType}
                                onValueChange={(value: "income" | "expense" | "both") => setNewCategoryType(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип категории" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Доход</SelectItem>
                                    <SelectItem value="expense">Расход</SelectItem>
                                    <SelectItem value="both">Оба</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={addCategory}>Добавить категорию</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Список категорий</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Тип</TableHead>
                                <TableHead>Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        {category.type === "both" ? "Доход и расход" : category.type === "income" ? "Доход" : "Расход"}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

