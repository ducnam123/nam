import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context/TransactionsContext";
import { useToast } from "@/hooks/use-toast";

export default function ExportData() {
  const { transactions, dateRange } = useTransactions();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Filter transactions by date range if specified
      const filteredTransactions = transactions.filter(tx => {
        if (!dateRange.from || !dateRange.to) return true;
        
        const txDate = new Date(tx.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        
        return txDate >= fromDate && txDate <= toDate;
      });
      
      // Define CSV headers
      const headers = [
        "Ngày", 
        "Loại", 
        "Số tiền", 
        "Phương thức", 
        "Danh mục",
        "Ghi chú"
      ].join(",");
      
      // Convert transactions to CSV rows
      const rows = filteredTransactions.map(tx => {
        return [
          tx.date,
          tx.type === "income" ? "Thu" : "Chi",
          tx.amount,
          tx.method,
          tx.category,
          `"${tx.note.replace(/"/g, '""')}"` // Escape quotes in notes
        ].join(",");
      });
      
      // Combine headers and rows
      const csvContent = [headers, ...rows].join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute(
        "download", 
        `doanh-thu-tap-hoa-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: `Đã xuất ${filteredTransactions.length} giao dịch`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi xuất dữ liệu",
        description: "Có lỗi xảy ra khi xuất dữ liệu"
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xuất...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Xuất dữ liệu
        </>
      )}
    </Button>
  );
}