import Transaction from "./schema";
import SalesOrder, { ISalesOrderModel } from "./salesOrder/schema";
import Invoice, { IInvoiceModel } from "./invoice/schema";
import ItemFulfillment, { IItemFulfillmentModel } from "./itemFulfillment/schema";
import ItemReceipt, { IItemReceiptModel } from "./itemReceipt/schema";
import InventoryAdjustment, { IInventoryAdjustmentModel } from "./inventoryAdjustment/schema";
import PurchaseOrder, { IPurchaseOrderModel } from "./purchaseOrder/schema";
export default Transaction;

interface Types {
  salesorder: ISalesOrderModel;
  invoice: IInvoiceModel;
  itemfulfillment: IItemFulfillmentModel;
  itemreceipt: IItemReceiptModel;
  inventoryadjustment: IInventoryAdjustmentModel;
  purchaseorder: IPurchaseOrderModel;

}

export const TransactionTypes: Types = {
  salesorder: SalesOrder,
  invoice: Invoice,
  itemfulfillment: ItemFulfillment,
  itemreceipt: ItemReceipt,
  inventoryadjustment: InventoryAdjustment,
  purchaseorder: PurchaseOrder
};
