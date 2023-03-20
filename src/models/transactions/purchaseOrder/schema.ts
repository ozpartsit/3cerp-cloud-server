import { Schema, Model, model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "transactions" };

export interface IPurchaseOrder extends ITransaction { }
export interface IPurchaseOrderModel extends Model<IPurchaseOrder>, IExtendedModel { }

const schema = new Schema<IPurchaseOrder>({}, options);

const PurchaseOrder: IPurchaseOrderModel = Transaction.discriminator<
    IPurchaseOrder,
    IPurchaseOrderModel
>("PurchaseOrder", schema);

export default PurchaseOrder;
