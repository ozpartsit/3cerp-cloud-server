import Transaction from "./schema";
import SalesOrder, { ISalesOrderModel } from "./salesOrder/schema";
import Invoice, { IInvoiceModel } from "./invoice/schema";
import ItemFulfillment, { IItemFulfillmentModel } from "./itemFulfillment/schema";
export default Transaction;

interface Types {
  salesorder: ISalesOrderModel;
  invoice: IInvoiceModel;
  itemfulfillment: IItemFulfillmentModel;
}

export const TransactionTypes: Types = {
  salesorder: SalesOrder,
  invoice: Invoice,
  itemfulfillment: ItemFulfillment
};
