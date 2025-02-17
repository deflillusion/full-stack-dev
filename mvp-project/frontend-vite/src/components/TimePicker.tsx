"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TimePickerProps {
    value: string
    onChange: (time: string) => void
    onClose: () => void
}

export function TimePicker({ value, onChange, onClose }: TimePickerProps) {
    const [selectedHour, setSelectedHour] = useState(Number.parseInt(value.split(":")[0]))
    const [selectedMinute, setSelectedMinute] = useState(Number.parseInt(value.split(":")[1]))
    const [mode, setMode] = useState<"hour" | "minute">("hour")

    const handleHourClick = (hour: number) => {
        setSelectedHour(hour)
        setMode("minute")
    }

    const handleMinuteClick = (minute: number) => {
        setSelectedMinute(minute)
        onChange(`${selectedHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
        onClose()
    }

    const renderClockFace = () => {
        const items = mode === "hour" ? [...Array(24).keys()] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
        const radius = 140
        const innerRadius = 100
        const angleStep = (2 * Math.PI) / 12

        return (
            <div className="relative w-[300px] h-[300px]">
                {items.map((item, index) => {
                    const isInnerCircle = mode === "hour" && index < 12
                    const currentRadius = isInnerCircle ? innerRadius : radius
                    const angle = (index % 12) * angleStep - Math.PI / 2
                    const x = currentRadius * Math.cos(angle) + 150
                    const y = currentRadius * Math.sin(angle) + 150

                    return (
                        <Button
                            key={item}
                            className={`absolute w-8 h-8 p-0 rounded-full ${isInnerCircle ? "text-sm" : ""}`}
                            style={{ left: `${x}px`, top: `${y}px`, transform: "translate(-50%, -50%)" }}
                            onClick={() => (mode === "hour" ? handleHourClick(item) : handleMinuteClick(item))}
                            variant={
                                mode === "hour"
                                    ? selectedHour === item
                                        ? "default"
                                        : "outline"
                                    : selectedMinute === item
                                        ? "default"
                                        : "outline"
                            }
                        >
                            {mode === "hour" ? (item === 0 ? "00" : item) : item}
                        </Button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-lg">
            <div className="text-2xl mb-4">
                {selectedHour.toString().padStart(2, "0")}:{selectedMinute.toString().padStart(2, "0")}
            </div>
            {renderClockFace()}
            <div className="mt-4">
                <Button onClick={() => setMode("hour")} variant={mode === "hour" ? "default" : "outline"}>
                    Часы
                </Button>
                <Button onClick={() => setMode("minute")} variant={mode === "minute" ? "default" : "outline"}>
                    Минуты
                </Button>
            </div>
        </div>
    )
}

