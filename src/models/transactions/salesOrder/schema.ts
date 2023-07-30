import { Schema, model, models, Model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
const lineModel = models.Line.discriminator("LineSalesOrder", LineSalesOrder);
const options = { discriminatorKey: "type", collection: "transactions" };

export interface ISalesOrder extends ITransaction {
  shippingCost: number;
  //accounting
  terms?: Schema.Types.ObjectId;
  paymentMethod?: Schema.Types.ObjectId;
  lines: ILineSalesOrder[];
}
export interface ISalesOrderModel extends Model<ISalesOrder>, IExtendedModel<ISalesOrder> { }

const schema = new Schema<ISalesOrder>(
  {
    shippingCost: { type: Number, default: 0, input: "CurrencyField" },
    terms: {
      type: Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "SelectField"
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      autopopulate: true,
      input: "SelectField"
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
