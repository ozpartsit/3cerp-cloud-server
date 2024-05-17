import * as mongoose from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
import Line from "../line.schema.js";
import form from "./form"

const lineModel = Line.discriminator("LineSalesOrder", LineSalesOrder);
const options = { discriminatorKey: "type", collection: "transactions" };

export interface ISalesOrder extends ITransaction {
  shippingCost: number;
  //accounting
  terms?: mongoose.Schema.Types.ObjectId;
  paymentMethod?: mongoose.Schema.Types.ObjectId;
  lines: ILineSalesOrder[];
}
export interface ISalesOrderModel extends mongoose.Model<ISalesOrder>, IExtendedModel<ISalesOrder> { }

const schema = new mongoose.Schema<ISalesOrder>(
  {
    shippingCost: { type: Number, default: 0, input: "Input", validType: "currency" },
    terms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "Select",
      validType: "select"
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      autopopulate: true,
      input: "Select",
      validType: "select"
    },
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
  copyFields: ["entity", "account"],
});

schema.pre("validate", async function (next) {
  console.log("salesorder pre valide");
  next();
});

schema.static("form", () => form)

const SalesOrder: ISalesOrderModel = Transaction.discriminator<
  ISalesOrder,
  ISalesOrderModel
>("salesorder", schema);
export default SalesOrder;
