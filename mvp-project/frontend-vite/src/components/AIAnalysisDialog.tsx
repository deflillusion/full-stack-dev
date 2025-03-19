import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ApiAiAnalysis, ApiAiAnalysisOld } from "@/types/types"
import { cn } from "@/lib/utils"
import dayjs from "dayjs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface AIAnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading: boolean;
    error: string | null;
    analysis: ApiAiAnalysis | ApiAiAnalysisOld | null;
}

export function AIAnalysisDialog({
    open,
    onOpenChange,
    isLoading,
    error,
    analysis
}: AIAnalysisDialogProps) {
    const [activeTab, setActiveTab] = useState("trends");

    // Проверяем формат данных (новый или старый)
    const isOldFormat = analysis && 'insights' in analysis;
    const isNewFormat = analysis && 'trends' in analysis;

    // Преобразуем старый формат в новый для единообразного отображения
    let displayData: ApiAiAnalysis | null = null;
    if (isOldFormat) {
        const oldData = analysis as ApiAiAnalysisOld;
        displayData = {
            trends: {
                insights: oldData.insights?.summary || [],
                recommendations: []
            },
            seasonal: {
                insights: oldData.seasonal_insights?.summary || [],
                recommendations: []
            },
            anomalies: {
                items: oldData.anomalies?.income_anomalies?.map(a => ({
                    period: a.month,
                    description: `Доход: ${a.value} (отклонение: ${a.deviation})`
                })) || [],
                recommendations: oldData.anomalies?.summary || []
            },
            budget: {
                recommendations: oldData.budget_recommendations?.summary || [],
                savings_potential: oldData.budget_recommendations?.recommendations?.recommended_savings
                    ? `Рекомендуемая экономия: ${oldData.budget_recommendations.recommendations.recommended_savings}`
                    : undefined
            }
        };
    } else if (isNewFormat) {
        displayData = analysis as ApiAiAnalysis;
    }

    // Проверка на наличие данных в нужном формате
    const hasAnalysisData = displayData &&
        ((displayData.trends && displayData.seasonal && displayData.anomalies && displayData.budget) ||
            isOldFormat);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ИИ-анализ финансов</DialogTitle>
                    <DialogDescription>
                        Анализ ваших финансовых данных за последние 12 месяцев с помощью искусственного интеллекта.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p>Анализируем ваши данные...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="text-center py-6">
                        <p className="text-red-500 mb-2">{error}</p>
                        <p className="text-muted-foreground text-sm">
                            Пожалуйста, повторите попытку позже или обратитесь в поддержку.
                        </p>
                    </div>
                )}

                {!isLoading && !error && hasAnalysisData && displayData ? (
                    <Tabs defaultValue="trends" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="trends">Тренды</TabsTrigger>
                            <TabsTrigger value="seasonal">Сезонность</TabsTrigger>
                            <TabsTrigger value="anomalies">Аномалии</TabsTrigger>
                            <TabsTrigger value="budget">Бюджет</TabsTrigger>
                        </TabsList>

                        <div className="overflow-y-auto pr-1 max-h-[50vh] sm:max-h-[60vh]">
                            <TabsContent value="trends" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Основные тренды</CardTitle>
                                        <CardDescription>Анализ общей динамики доходов и расходов</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Выводы</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                {displayData.trends.insights.map((insight, idx) => (
                                                    <li key={idx}>{insight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {displayData.trends.recommendations && displayData.trends.recommendations.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Рекомендации</h4>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {displayData.trends.recommendations.map((recommendation, idx) => (
                                                        <li key={idx}>{recommendation}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="seasonal" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Сезонный анализ</CardTitle>
                                        <CardDescription>Периодические изменения в ваших финансах</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Выводы</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                {displayData.seasonal.insights.map((insight, idx) => (
                                                    <li key={idx}>{insight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {displayData.seasonal.recommendations && displayData.seasonal.recommendations.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Рекомендации</h4>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {displayData.seasonal.recommendations.map((recommendation, idx) => (
                                                        <li key={idx}>{recommendation}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="anomalies" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Обнаруженные аномалии</CardTitle>
                                        <CardDescription>Необычные изменения в ваших финансовых транзакциях</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {displayData.anomalies.items && displayData.anomalies.items.length > 0 ? (
                                            <>
                                                <div>
                                                    <h4 className="font-medium mb-2">Аномалии</h4>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        {displayData.anomalies.items.map((anomaly, idx) => (
                                                            <li key={idx}>
                                                                <span className="font-medium">{anomaly.period}:</span>{" "}
                                                                {anomaly.description}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {displayData.anomalies.recommendations && displayData.anomalies.recommendations.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium mb-2">Рекомендации</h4>
                                                        <ul className="list-disc pl-5 space-y-2">
                                                            {displayData.anomalies.recommendations.map((recommendation, idx) => (
                                                                <li key={idx}>{recommendation}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p>Аномалий в ваших финансовых данных не обнаружено.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="budget" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Бюджетные рекомендации</CardTitle>
                                        <CardDescription>Советы по оптимизации вашего бюджета</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {displayData.budget.recommendations && displayData.budget.recommendations.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Основные рекомендации</h4>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {displayData.budget.recommendations.map((recommendation, idx) => (
                                                        <li key={idx}>{recommendation}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {displayData.budget.savings_potential && (
                                            <div className="p-4 border rounded-md bg-muted">
                                                <h4 className="font-medium mb-2">Потенциал экономии</h4>
                                                <p>{displayData.budget.savings_potential}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                ) : !isLoading && !error ? (
                    <div className="text-center py-6">
                        <p className="text-yellow-500 mb-2">Данные анализа в неправильном формате или отсутствуют</p>
                        <p className="text-muted-foreground text-sm">
                            Пожалуйста, повторите попытку позже или обратитесь в поддержку.
                        </p>
                    </div>
                ) : null}

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Закрыть
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 