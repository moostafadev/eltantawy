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
   * Percentage change from the previous month. Null for the first month or
   * when the previous month's value is zero to avoid division by zero.
   */
  change: number | null;
}

export interface TopProduct {
  productId: string;
  title: string;
  qty: number;
  total: number;
}
