import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/context/TransactionsContext";

export default function DateRangeFilter() {
  const { dateRange, setDateRange } = useTransactions();
  const [date, setDate] = useState<DateRange | undefined>({
    from: dateRange.from ? new Date(dateRange.from) : undefined,
    to: dateRange.to ? new Date(dateRange.to) : undefined,
  });

  useEffect(() => {
    if (date?.from) {
      setDateRange({
        from: format(date.from, "yyyy-MM-dd"),
        to: date.to ? format(date.to, "yyyy-MM-dd") : undefined,
      });
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  }, [date, setDateRange]);

  const clearFilter = () => {
    setDate(undefined);
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <Card className="border border-muted animate-in fade-in-0 zoom-in-95 duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Lọc theo khoảng thời gian</h3>
            {dateRange.from && (
              <Badge variant="secondary" className="text-xs">
                {dateRange.from} {dateRange.to ? `→ ${dateRange.to}` : ""}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-left w-[240px] justify-start flex gap-1"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy")} -{" "}
                        {format(date.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            {dateRange.from && (
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                Xoá lọc
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}