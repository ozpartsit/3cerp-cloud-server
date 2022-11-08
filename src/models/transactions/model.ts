import Transaction from "./schema";
import SalesOrder, { ISalesOrderModel } from "./salesOrder/schema";
import Invoice, { IInvoiceModel } from "./invoice/schema";

export default Transaction;

interface Types {
  salesorder: ISalesOrderModel;
  invoice: IInvoiceModel;
}

export const TransactionTypes: Types = {
  salesorder: SalesOrder,
  invoice: Invoice
};
