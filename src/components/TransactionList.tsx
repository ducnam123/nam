import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Search, Trash2, FilterX } from "lucide-react";
import { useTransactions } from "@/context/TransactionsContext";
import { getCategoryColor, getMethodIcon, formatCurrency } from "@/utils/helpers";
import { TransactionType } from "@/types";
import { EMPLOYEES } from "@/utils/constants";

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TransactionType;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const handleSort = (key: keyof TransactionType) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    if (a[key] < b[key]) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredTransactions = sortedTransactions.filter(tx => {
    if (!searchTerm) return true;
    
    const employeeName = tx.employeeId ? 
      EMPLOYEES.find(emp => emp.value === tx.employeeId)?.label.toLowerCase() : '';
    
    return (
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employeeName && employeeName.includes(searchTerm.toLowerCase()))
    );
  });

  const confirmDelete = (id: string) => {
    if (confirm("Xoá giao dịch này?")) {
      deleteTransaction(id);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    return EMPLOYEES.find(emp => emp.value === employeeId)?.label || employeeId;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Danh sách giao dịch</CardTitle>
            <CardDescription>
              {filteredTransactions.length} giao dịch
            </CardDescription>
          </div>
          
          <div className="relative w-full md:w-auto md:min-w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[100px] cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Ngày
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Số tiền
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Loại
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy giao dịch nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group">
                    <TableCell>{tx.date}</TableCell>
                    <TableCell className={tx.type === 'expense' ? 'text-destructive' : 'text-green-600'}>
                      {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={tx.type === 'expense' ? 'destructive' : 'default'}
                        className="font-normal"
                      >
                        {tx.type === 'expense' ? 'Chi' : 'Thu'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getMethodIcon(tx.method)}
                        <span>{tx.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(tx.category)} font-normal`}
                      >
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.employeeId && (
                        <Badge variant="outline" className="font-normal">
                          {getEmployeeName(tx.employeeId)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {tx.note}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => confirmDelete(tx.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xoá
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}