import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Account } from "@/types/types"

interface AccountSelectorProps {
    accounts: Account[];
    selectedAccount: string;
    onSelectAccount: (account: string) => void;
    isLoading?: boolean;
    error?: string | null;
}

export function AccountSelector({
    accounts,
    selectedAccount,
    onSelectAccount,
    isLoading,
    error
}: AccountSelectorProps) {
    if (isLoading) {
        return (
            <Select disabled>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Загрузка..." />
                </SelectTrigger>
            </Select>
        );
    }

    if (error) {
        return (
            <Select disabled>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ошибка загрузки" />
                </SelectTrigger>
            </Select>
        );
    }

    return (
        <Select value={selectedAccount} onValueChange={onSelectAccount}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите счет" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Все счета">Все счета</SelectItem>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}