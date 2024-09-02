import * as mongoose from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
import Line from "../line.schema.js";
import form from "./form"
import { ICustomer } from "../../entities/customer/schema.js";

const lineModel = Line.discriminator("LineSalesOrder", LineSalesOrder);
const options = { discriminatorKey: "type", collection: "transactions" };

export interface ISalesOrder extends ITransaction {
  shippingCost: number;
  //accounting
  terms?: mongoose.Schema.Types.ObjectId;
  paymentMethod?: mongoose.Schema.Types.ObjectId;
  promoCode: string;
  lines: ILineSalesOrder[];
  setDefaultFields(): any
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
    promoCode: { type: String, input: "Input", validType: "text" },
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


schema.method("recalc", async function () {
  console.log("recalc", "salesorder")

  for (let trigger of this.$locals.triggers) {
    console.log(`${trigger.type}_${trigger.field}`)

    if (trigger.type == "addDocument") await this.setDefaultFields()
    if (trigger.type == "setValue" && trigger.field == "entity") await this.setDefaultFields()

    this.$locals.triggers.shift();
  }

})
// Uzupełnianie domyśłnych pól
schema.method("setDefaultFields", async function () {
  console.log("setDefaultFields")
  // uzupełnianie dokumentu na podstawie ustawień Customera
  if (this.entity) {
    await this.populate("entity", ["paymentMethod", "terms", "currency", "billingAddress", "shippingAddress"]);
    // Typujemy this.entity jako ICustomer po populacji
    const entity = this.entity as unknown as ICustomer;

    // Destrukturyzacja obiektu entity
    const { paymentMethod, terms, currency, billingAddress, shippingAddress } = entity.toObject();

    if (paymentMethod) this.paymentMethod = paymentMethod;
    if (terms) this.terms = terms;
    if (currency) this.currency = currency;

    if (billingAddress) this.billingAddress = billingAddress;
    if (shippingAddress) this.shippingAddress = shippingAddress;
  }
})

const SalesOrder: ISalesOrderModel = Transaction.discriminator<
  ISalesOrder,
  ISalesOrderModel
>("salesorder", schema);
export default SalesOrder;
