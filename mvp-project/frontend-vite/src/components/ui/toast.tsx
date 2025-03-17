import { useToast } from "./use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast, index) => (
                <div
                    key={index}
                    className={cn(
                        "p-4 rounded-lg shadow-lg max-w-sm",
                        "bg-white dark:bg-gray-800",
                        "border border-gray-200 dark:border-gray-700",
                        toast.variant === "destructive" && "bg-red-50 dark:bg-red-900"
                    )}
                >
                    {toast.title && (
                        <div className={cn(
                            "font-semibold",
                            toast.variant === "destructive" && "text-red-900 dark:text-red-50"
                        )}>
                            {toast.title}
                        </div>
                    )}
                    {toast.description && (
                        <div className={cn(
                            "text-sm text-gray-500 dark:text-gray-400",
                            toast.variant === "destructive" && "text-red-800 dark:text-red-200"
                        )}>
                            {toast.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
} 