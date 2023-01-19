import { Schema, Model, model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "transactions" };

export interface IItemFulfillment extends ITransaction {}
export interface IItemFulfillmentModel extends Model<IItemFulfillment>, IExtendedModel {}

const schema = new Schema<IItemFulfillment>({}, options);

const ItemFulfillment: IItemFulfillmentModel = Transaction.discriminator<
IItemFulfillment,
IItemFulfillmentModel
>("ItemFulfillment", schema);

export default ItemFulfillment;
