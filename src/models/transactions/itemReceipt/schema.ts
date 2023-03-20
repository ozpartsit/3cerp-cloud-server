import { Schema, Model, model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "transactions" };

export interface IItemReceipt extends ITransaction { }
export interface IItemReceiptModel extends Model<IItemReceipt>, IExtendedModel { }

const schema = new Schema<IItemReceipt>({}, options);

const ItemReceipt: IItemReceiptModel = Transaction.discriminator<
    IItemReceipt,
    IItemReceiptModel
>("ItemReceipt", schema);

export default ItemReceipt;
