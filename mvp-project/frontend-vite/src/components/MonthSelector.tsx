import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs"
import "dayjs/locale/ru"

interface MonthSelectorProps {
    currentMonth: string
    onPreviousMonth: () => void
    onNextMonth: () => void
}

export function MonthSelector({ currentMonth, onPreviousMonth, onNextMonth }: MonthSelectorProps) {
    dayjs.locale("ru")

    const formattedMonth = dayjs(currentMonth).format("MMMM YYYY").toLowerCase()
    // Capitalize first letter
    const capitalizedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1)

    return (
        <div className="flex items-center border rounded border-input h-10 px-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">{capitalizedMonth}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
