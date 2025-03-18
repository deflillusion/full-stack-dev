import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

// Стили для улучшения взаимодействия с категориями
const categoryItemStyles = {
    padding: '4px 6px',
    margin: '1px 0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
};

const activeItemStyles = {
    ...categoryItemStyles,
    backgroundColor: 'rgba(var(--accent), 0.2)'
};

const hoverEffect = {
    ':hover': {
        backgroundColor: 'rgba(var(--accent), 0.1)'
    }
};

interface CategorySelectorProps {
    categories: Array<{
        id: number
        name: string
    }> | null
    selectedCategory: string
    onSelectCategory: (category: string) => void
    isLoading?: boolean
    error?: string | null
    align?: "start" | "center" | "end"
}

export function CategorySelector({
    categories,
    selectedCategory,
    onSelectCategory,
    isLoading,
    error,
    align = "start"
}: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    if (isLoading) {
        return <Button disabled variant="outline" className="w-full md:w-[200px] justify-between">
            Загрузка категорий...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    }

    if (error) {
        return <Button disabled variant="outline" className="w-full md:w-[200px] justify-between text-red-500">
            Ошибка загрузки
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    }

    const handleCategorySelect = (category: string) => {
        console.log("Выбрана категория:", category);
        setTimeout(() => {
            onSelectCategory(category);
            setIsOpen(false);
            setSearchQuery('');
        }, 0);
    }

    const handleItemClick = (category: string) => {
        console.log("Клик по категории:", category);
        handleCategorySelect(category);
    }

    const filteredCategories = searchQuery
        ? categories?.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : categories

    // Определяем, нужно ли показывать сообщение о пустом результате поиска
    const showEmptyResults = searchQuery && (!filteredCategories || filteredCategories.length === 0)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-full justify-between md:w-[200px]"
                >
                    {selectedCategory || "Выберите категорию"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align={align} className="w-full p-0 md:w-[200px]">
                <Command>
                    <div className="flex items-center border-b px-2 py-1">
                        <Search className="mr-1 h-3 w-3 shrink-0 opacity-50" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск категории..."
                            className="flex h-7 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    {showEmptyResults && (
                        <div className="py-2 text-xs text-center text-muted-foreground">
                            Категории не найдены
                        </div>
                    )}
                    {!showEmptyResults && (
                        <CommandGroup className="max-h-[180px] overflow-y-auto p-1">
                            <div
                                key="all-category"
                                className={`rounded-sm ${selectedCategory === "Все категории" ? "bg-accent/20" : "hover:bg-accent/10"}`}
                                style={selectedCategory === "Все категории" ? activeItemStyles : categoryItemStyles}
                                onClick={() => handleItemClick("Все категории")}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-3 w-3",
                                        selectedCategory === "Все категории" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                Все категории
                            </div>
                            {filteredCategories?.map((category) => (
                                <div
                                    key={category.id}
                                    className={`rounded-sm ${selectedCategory === category.name ? "bg-accent/20" : "hover:bg-accent/10"}`}
                                    style={selectedCategory === category.name ? activeItemStyles : categoryItemStyles}
                                    onClick={() => handleItemClick(category.name)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-3 w-3",
                                            selectedCategory === category.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {category.name}
                                </div>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
} 