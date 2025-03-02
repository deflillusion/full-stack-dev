import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useExpensesByCategory } from "@/hooks/useExpensesByCategory";
import { useEffect } from 'react';
import dayjs from "dayjs";

interface CategoryPieChartProps {
  currentMonth: string;
  selectedAccount?: string;
  accounts: Array<{
    id: number;
    name: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function CategoryPieChart({ currentMonth, selectedAccount, accounts }: CategoryPieChartProps) {
  const { expenses, isLoading, error, fetchExpensesByCategory } = useExpensesByCategory();

  useEffect(() => {
    const [year, month] = currentMonth.split('-');
    const account = selectedAccount && selectedAccount !== "Все счета"
      ? accounts.find(a => a.id.toString() === selectedAccount) // теперь ищем по id
      : undefined;

    fetchExpensesByCategory(year, month, account?.id);
  }, [currentMonth, selectedAccount, accounts]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-600">{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={expenses}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
        >
          {expenses.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(2)} KZT`, 'Сумма']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}