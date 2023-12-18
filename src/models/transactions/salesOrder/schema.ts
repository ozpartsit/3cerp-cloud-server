import { Schema, model, models, Model } from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
import form from "./form.json"

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
    shippingCost: { type: Number, default: 0, input: "Input", validType: "currency" },
    terms: {
      type: Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "Select",
      validType: "select"
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
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
