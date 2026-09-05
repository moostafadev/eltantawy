export interface SalesSummary {
  totalSales: number;
  deliveredOrdersCount: number;
  averageOrderValue: number;
  totalReturnsAmount: number;
  returnsRequestsCount: number;
  pendingReturnsCount: number;
  approvedReturnsCount: number;
  refundedReturnsCount: number;
  rejectedReturnsCount: number;
}

export interface MonthlySales {
  label: string;
  value: number;
}

export interface MonthlySalesRow extends MonthlySales {
  /**
   * نسبة التغيير عن الشهر السابق (%). null لأول شهر في القائمة
   * أو لو قيمة الشهر السابق صفر (تفاديًا للقسمة على صفر)
   */
  change: number | null;
}

export interface TopProduct {
  productId: string;
  title: string;
  qty: number;
  total: number;
}
