import { useState } from "react"

interface ToastProps {
    variant?: "default" | "destructive"
    title?: string
    description?: string
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const toast = (props: ToastProps) => {
        setToasts((prev) => [...prev, props])
        setTimeout(() => {
            setToasts((prev) => prev.slice(1))
        }, 3000)
    }

    return {
        toast,
        toasts,
    }
} 