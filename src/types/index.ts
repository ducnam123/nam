export type TransactionType = {
  id: string;
  date: string;
  amount: number;
  method: string;
  note: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  employeeId?: string;
};

export type DateRangeType = {
  from: string | undefined;
  to: string | undefined;
};