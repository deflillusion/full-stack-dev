import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AccountSelectorProps {
    accounts: string[]
    selectedAccount: string
    onSelectAccount: (account: string) => void
}

export function AccountSelector({ accounts, selectedAccount, onSelectAccount }: AccountSelectorProps) {
    return (
        <Select value={selectedAccount} onValueChange={onSelectAccount}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Выберите счет" />
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                        {account}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

