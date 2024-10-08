import * as mongoose from "mongoose";
import Transaction, { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import LineSalesOrder, { ILineSalesOrder } from "./line.schema";
import Line from "../line.schema.js";
import form from "./form"
import Customer, { ICustomer } from "../../entities/customer/schema.js";
import Address from "../../address.model.js";
import Shop from "../../ecommerce/shop.model.js";


const lineModel = Line.discriminator("LineSalesOrder", LineSalesOrder);
const options = { discriminatorKey: "type", collection: "transactions" };

export interface ISalesOrder extends ITransaction {
  shippingCost: number;
  //accounting
  terms?: mongoose.Schema.Types.ObjectId;
  shop?: mongoose.Schema.Types.ObjectId;
  paymentMethod?: mongoose.Schema.Types.ObjectId;
  promoCode: string;
  email: string;
  phone: string;
  lines: ILineSalesOrder[];
  setDefaultFields(): any
  setAddress(field: string, address: string): any
}
export interface ISalesOrderModel extends mongoose.Model<ISalesOrder>, IExtendedModel<ISalesOrder> { }

const schema = new mongoose.Schema<ISalesOrder>(
  {
    email: { type: String, input: "Input", validType: "email", min: 3, max: 256 },
    phone: { type: String, input: "Input", validType: "phone", min: 6, max: 15 },
    shippingCost: { type: Number, default: 0, input: "Input", validType: "currency" },
    terms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "Select",
      validType: "select"
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "webshop",
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
  copyFields: ["entity", "account", "currency"],
});

schema.pre("validate", async function (next) {
  console.log("salesorder pre valide");

  // Tworzenie klienta na podatwie danych adresowych
  if (!this.entity) {
    if (this.billingAddress && this.billingAddress.name) {
      let customer = await new Customer({
        account: this.account,
        name: this.billingAddress.name,
        email: this.email || this.billingAddress.email,
        phone: this.phone || this.billingAddress.phone,
        billingAddress: this.billingAddress,
        shippingAddress: this.shippingAddress || this.billingAddress,
        currency: this.currency,
        terms: this.terms,
        taxNumber: this.taxNumber,
        salesRep: this.salesRep,
        taxRate: this.taxRate,
        paymentMethod: this.paymentMethod,

      }).save();
      this.entity = customer._id
    }
  }

  if (!this.shippingAddress && !this.shipToDifferentAddress) {
    this.shippingAddress = this.billingAddress
  }
  next();

});

schema.static("form", () => form)



schema.method("recalc", async function () {
  console.log("recalc", "salesorder")

  for (let trigger of this.$locals.triggers) {
    console.log(`${trigger.type}_${trigger.field}`)

    if (trigger.type == "addDocument") await this.setDefaultFields()
    if (trigger.type == "setValue" && trigger.field == "entity") await this.setDefaultFields()
    if (trigger.type == "setValue" && trigger.field == "billingAddress") await this.setAddress("billingAddress", trigger.value)
    if (trigger.type == "setValue" && trigger.field == "shippingAddress") await this.setAddress("shippingAddress", trigger.value)

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
    const { paymentMethod, terms, currency, billingAddress, shippingAddress, email, phone } = entity.toObject();

    if (paymentMethod) this.paymentMethod = paymentMethod;
    if (terms) this.terms = terms;
    if (currency) this.currency = currency;
    if (email) this.email = email;
    if (phone) this.phone = phone;

    if (billingAddress) {
      this.billingAddress = billingAddress;
      if (email && this.billingAddress && !this.billingAddress.email) this.billingAddress.email = email;
      if (phone && this.billingAddress && !this.billingAddress.phone) this.billingAddress.phone = phone
    }
    if (shippingAddress) this.shippingAddress = shippingAddress;
  }
})

// ustawienie całęgo adresu
schema.method("setAddress", async function (field, address) {
  this[field] = await Address.findById(address)


})
const SalesOrder: ISalesOrderModel = Transaction.discriminator<
  ISalesOrder,
  ISalesOrderModel
>("salesorder", schema);
export default SalesOrder;
