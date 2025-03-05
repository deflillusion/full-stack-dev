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

    const formattedMonth = dayjs(currentMonth).format("MMMM YYYY")

    return (
        <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium">{formattedMonth}</span>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
