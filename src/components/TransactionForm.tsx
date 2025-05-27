import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/context/TransactionsContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORIES, PAYMENT_METHODS, TRANSACTION_TYPES, EMPLOYEES } from "@/utils/constants";

export default function TransactionForm() {
  const { toast } = useToast();
  const { addTransaction } = useTransactions();
  
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    method: "",
    category: "",
    type: "income",
    note: "",
    employeeId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || !form.method || !form.category) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }
    
    const newTx = { 
      ...form, 
      amount: parseFloat(form.amount),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    addTransaction(newTx);
    
    toast({
      title: "Thành công",
      description: "Đã thêm giao dịch mới",
    });
    
    setForm({
      date: format(new Date(), "yyyy-MM-dd"),
      amount: "",
      method: "",
      category: "",
      type: "income",
      note: "",
      employeeId: ""
    });
  };

  const showEmployeeField = form.category === "Lương nhân viên" || form.category === "Thưởng nhân viên";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thêm giao dịch mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Ngày</Label>
                <Input 
                  id="date"
                  type="date" 
                  value={form.date} 
                  onChange={(e) => setForm({ ...form, date: e.target.value })} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền</Label>
                <Input 
                  id="amount"
                  type="number" 
                  placeholder="Số tiền" 
                  value={form.amount} 
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Loại giao dịch</Label>
              <RadioGroup 
                value={form.type} 
                onValueChange={(value) => setForm({ ...form, type: value })}
                className="flex gap-4"
              >
                {TRANSACTION_TYPES.map(type => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>{type.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Hình thức thanh toán</Label>
                <Select 
                  value={form.method}
                  onValueChange={(value) => setForm({ ...form, method: value })}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Hình thức thanh toán</SelectLabel>
                      {PAYMENT_METHODS.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select 
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Danh mục</SelectLabel>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showEmployeeField && (
              <div className="space-y-2">
                <Label htmlFor="employee">Nhân viên</Label>
                <Select
                  value={form.employeeId}
                  onValueChange={(value) => setForm({ ...form, employeeId: value })}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Nhân viên</SelectLabel>
                      {EMPLOYEES.map(employee => (
                        <SelectItem key={employee.value} value={employee.value}>
                          {employee.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea 
                id="note"
                placeholder="Ghi chú" 
                value={form.note} 
                onChange={(e) => setForm({ ...form, note: e.target.value })} 
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Thêm giao dịch</Button>
        </form>
      </CardContent>
    </Card>
  );
}