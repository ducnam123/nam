import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactions } from "@/context/TransactionsContext";
import { formatCurrency } from "@/utils/helpers";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Analytics() {
  const { transactions, dateRange } = useTransactions();
  const [analysisType, setAnalysisType] = useState("overview");
  
  // Filter transactions based on type and date range
  const filteredTransactions = transactions.filter(tx => {
    if (!dateRange.from || !dateRange.to) return true;
    
    const txDate = new Date(tx.date);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    return txDate >= fromDate && txDate <= toDate;
  });
  
  const income = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const expenses = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const profit = income - expenses;
  
  // Method breakdown
  const methodData = Object.entries(
    filteredTransactions.reduce((acc, tx) => {
      acc[tx.method] = (acc[tx.method] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  
  // Category breakdown
  const categoryData = Object.entries(
    filteredTransactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  
  // Income/Expense data by day
  const dailyData = filteredTransactions.reduce((acc, tx) => {
    const date = tx.date;
    
    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }
    
    if (tx.type === 'income') {
      acc[date].income += tx.amount;
    } else {
      acc[date].expense += tx.amount;
    }
    
    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number }>);
  
  const barChartData = Object.values(dailyData).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(income)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(expenses)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {formatCurrency(profit)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={analysisType} onValueChange={setAnalysisType}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="categories">Theo danh mục</TabsTrigger>
          <TabsTrigger value="methods">Theo phương thức</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ thu chi theo ngày</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Thu" fill="#4ade80" />
                    <Bar dataKey="expense" name="Chi" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích theo phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {methodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}