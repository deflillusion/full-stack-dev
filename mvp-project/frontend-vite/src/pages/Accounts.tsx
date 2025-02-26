// "use client"

// import { useState, useEffect } from "react"
// import { v4 as uuidv4 } from "uuid"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import type { Account } from "@/types/account"

// export default function Accounts() {
//     const [accounts, setAccounts] = useState<Account[]>([
//         { id: "1", name: "Наличные", balance: 1000 },
//         { id: "2", name: "Банковская карта", balance: 2500 },
//     ]);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6">Счета</h1>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {accounts.map((account) => (
//                     <Card key={account.id}>
//                         <CardHeader>
//                             <CardTitle>{account.name}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <p className="text-2xl font-semibold">
//                                 {account.balance.toLocaleString()} KZT
//                             </p>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }

