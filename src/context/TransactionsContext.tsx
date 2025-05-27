import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { TransactionType, DateRangeType } from "@/types";

type TransactionsContextType = {
  transactions: TransactionType[];
  addTransaction: (transaction: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionType[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("transactions");
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          
          // Convert old format to new format if needed
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            const firstItem = parsedData[0];
            
            // Check if it's the old format (no id, type, category)
            if (!firstItem.id || !firstItem.type || !firstItem.category) {
              return parsedData.map((item: any) => ({
                id: crypto.randomUUID(),
                date: item.date || new Date().toISOString().split('T')[0],
                amount: parseFloat(item.amount),
                method: item.method || "Tiền mặt",
                note: item.note || "",
                type: "income", // Default to income for old data
                category: "Hàng hoá", // Default category
                createdAt: new Date().toISOString()
              }));
            }
          }
          
          return parsedData;
        } catch (e) {
          console.error("Error parsing transactions:", e);
          return [];
        }
      }
    }
    return [];
  });
  
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: undefined,
    to: undefined
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: TransactionType) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <TransactionsContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        deleteTransaction, 
        dateRange, 
        setDateRange 
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  
  return context;
}