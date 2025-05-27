import { CreditCard, Wallet, Ban as Bank, DollarSign, CreditCard as CreditCardIcon } from "lucide-react";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Hàng hoá": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Dịch vụ": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    "Khuyến mãi": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "Hoàn tiền": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Khác (thu)": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    
    "Nhập hàng": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "Tiền thuê": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "Điện nước": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "Lương nhân viên": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    "Vận chuyển": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    "Marketing": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
    "Thuế phí": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
    "Thiết bị": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "Bảo trì": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
    "Khác (chi)": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };
  
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
};

export const getMethodIcon = (method: string) => {
  const icons: Record<string, JSX.Element> = {
    "Tiền mặt": <Wallet className="h-4 w-4 mr-1" />,
    "Chuyển khoản": <Bank className="h-4 w-4 mr-1" />,
    "Ví điện tử": <Wallet className="h-4 w-4 mr-1" />,
    "Thẻ tín dụng": <CreditCard className="h-4 w-4 mr-1" />,
    "Thẻ ghi nợ": <CreditCardIcon className="h-4 w-4 mr-1" />,
  };
  
  return icons[method] || <DollarSign className="h-4 w-4 mr-1" />;
};