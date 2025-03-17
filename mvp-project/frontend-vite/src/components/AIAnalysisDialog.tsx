import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AIAnalysisDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    error: string | null;
    analysis: string | null;
}

export function AIAnalysisDialog({
    isOpen,
    onClose,
    isLoading,
    error,
    analysis
}: AIAnalysisDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>AI Анализ транзакций</DialogTitle>
                    <DialogDescription>
                        Анализ ваших транзакций с помощью искусственного интеллекта
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="text-red-500 py-4">
                        {error}
                    </div>
                )}

                {analysis && (
                    <div className="whitespace-pre-wrap py-4">
                        {analysis}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 