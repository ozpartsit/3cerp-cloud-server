import { Schema, Model, model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "transactions" };

export interface IInventoryAdjustment extends ITransaction { }
export interface IInventoryAdjustmentModel extends Model<IInventoryAdjustment>, IExtendedModel { }

const schema = new Schema<IInventoryAdjustment>({}, options);

const InventoryAdjustment: IInventoryAdjustmentModel = Transaction.discriminator<
    IInventoryAdjustment,
    IInventoryAdjustmentModel
>("InventoryAdjustment", schema);

export default InventoryAdjustment;
