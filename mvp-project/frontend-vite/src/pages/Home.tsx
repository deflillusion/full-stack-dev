import { useState, useEffect } from 'react';
import { getTransactions } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
    Wallet as WalletCards,
    Receipt,
    PieChart,
    LogOut,
    Plus
} from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";

interface Transaction {
    id: number;
    description: string;
    amount: number;
    datetime: string;
}

interface MenuItem {
    icon: JSX.Element;
    title: string;
    path: string;
    color: string;
}

const Home: React.FC = () => {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: <Receipt className="h-6 w-6" />,
            title: "Transactions",
            path: "/transactions",
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            icon: <WalletCards className="h-6 w-6" />,
            title: "Accounts",
            path: "/accounts",
            bgColor: "bg-green-500/10",
            iconColor: "text-green-500"
        },
        {
            icon: <PieChart className="h-6 w-6" />,
            title: "Categories",
            path: "/categories",
            bgColor: "bg-orange-500/10",
            iconColor: "text-orange-500"
        }
    ];

    const handleLogout = (): void => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchRecentTransactions = async (): Promise<void> => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await getTransactions(token);
                setRecentTransactions(response.data.slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <h1 className="font-semibold text-lg">Finance Tracker</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="container py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <Card
                            key={item.title}
                            className="p-4 cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => navigate(item.path)}
                        >
                            <div className={`${item.bgColor} ${item.iconColor} p-3 rounded-lg w-fit`}>
                                {item.icon}
                            </div>
                            <h3 className="mt-3 font-medium text-sm">{item.title}</h3>
                        </Card>
                    ))}
                </div>

                <Card className="mt-6">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold">Recent Transactions</h2>
                    </div>
                    <ScrollArea className="h-[400px]">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium">{transaction.description}</p>
                                    <time className="text-sm text-gray-500">
                                        {new Date(transaction.datetime).toLocaleDateString()}
                                    </time>
                                </div>
                                <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                </span>
                            </div>
                        ))}
                    </ScrollArea>
                </Card>
            </main>

            <div className="fixed bottom-6 right-6 flex gap-2">
                <Button
                    size="lg"
                    onClick={() => navigate('/create-transaction')}
                    className="shadow-lg"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Transaction
                </Button>
            </div>
        </div>
    );
};

export default Home;