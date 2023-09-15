export interface ReceiptModel {
  id: number;
  receiptNo: string;
  cashierId: string;
  cashierName: string;
  tableId: number;
  tableName: string;
  paymentDate: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyPostcode: string;
  companyCity: string;
  companyState: string;
  paymentMethodName: string;
  paymentMethodId: string;
  totalAmount: number;
  paidAmount: number;
  tax1Amount: number;
  tax2Amount: number;
  roundingAmount: number;
  discountAmount: number;
  changeAmount: number;
  receiptItems: ReceiptModelReceiptItems[];
}
export interface ReceiptModelReceiptItems {
  orderType: string;
  skuNo: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  variant: string;
}
