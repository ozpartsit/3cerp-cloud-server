import { Schema, model, models, Model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
const lineModel = models.Line.discriminator("LineSalesOrder", LineSalesOrder);
const options = { discriminatorKey: "type", collection: "transactions" };

export interface ISalesOrder extends ITransaction {
  shippingCost: number;
  lines: ILineSalesOrder[];
}
export interface ISalesOrderModel extends Model<ISalesOrder>, IExtendedModel { }

const schema = new Schema<ISalesOrder>(
  {
    shippingCost: { type: Number, default: 0, input: "currency" },
  },
  options
);
schema.virtual("lines", {
  ref: "LineSalesOrder",
  localField: "_id",
  foreignField: "transaction",
  justOne: false,
  autopopulate: true,
  model: lineModel,
  copyFields: ["entity"]
});

schema.pre("validate", async function (next) {
  console.log("salesorder pre valide");
  next();
});

const SalesOrder: ISalesOrderModel = Transaction.discriminator<
  ISalesOrder,
  ISalesOrderModel
>("SalesOrder", schema);
export default SalesOrder;
