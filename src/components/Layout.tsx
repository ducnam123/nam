import { useState } from "react";
import { Moon, Sun, BarChart3, ListPlus, List, FileDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import Analytics from "@/components/Analytics";
import DateRangeFilter from "@/components/DateRangeFilter";
import ExportData from "@/components/ExportData";

export default function Layout() {
  const { theme, setTheme } = useTheme();
  const [showDateFilter, setShowDateFilter] = useState(false);

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý doanh thu tạp hóa</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="relative"
          >
            <Calendar className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {showDateFilter && <DateRangeFilter />}

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="transactions">
            <List className="h-4 w-4 mr-2" />
            <span>Giao dịch</span>
          </TabsTrigger>
          <TabsTrigger value="new">
            <ListPlus className="h-4 w-4 mr-2" />
            <span>Thêm mới</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Phân tích</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-end">
            <ExportData />
          </div>
          <TransactionList />
        </TabsContent>
        
        <TabsContent value="new">
          <TransactionForm />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}