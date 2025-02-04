import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import printPDF from "../../utilities/pdf/pdf";
import Entity, { IEntity } from "../entities/schema";
import Address, { IAddress, nestedSchema } from "../address.model";
import Line, { ILine } from "./line.schema";
import { geocode } from "../../utilities/usefull";

// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface ITransaction extends IExtendedDocument {
  _id: mongoose.Schema.Types.ObjectId;
  type: string;
  date: Date,
  name?: string;
  number?: number;
  status?: string;
  //company: IEntity["_id"];
  entity: IEntity["_id"];
  exchangeRate?: number;
  currency: string;
  lines: ILine[];
  amount: number;
  grossAmount: number;
  tax: number;
  taxAmount: number;
  taxNumber: string;
  taxRate: number;
  referenceNumber: string;
  memo: string;

  //address
  billingAddress?: IAddress
  shippingAddress?: IAddress
  shipToDifferentAddress?: Boolean;
  addresses?: IAddress[];

  //classsifictaions
  group?: mongoose.Schema.Types.ObjectId[];
  category?: mongoose.Schema.Types.ObjectId[];

  salesRep?: mongoose.Schema.Types.ObjectId;




  recalc(): any;
  autoName(): any;
  pdf(): any;
}
interface ITransactionModel extends mongoose.Model<ITransaction>, IExtendedModel<ITransaction> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const TransactionSchema = {
  name: { type: String, input: "Input", validType: "text" },
  date: { type: Date, input: "DatePicker", validType: "date", required: true, defaultSelect: true, default: new Date() },
  // company: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Company",
  //   required: false,
  //   autopopulate: true,
  //   input: "Select",
  //   validType: "select",
  // },
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entity",
    required: true,
    autopopulate: true,
    input: "Select",
    validType: "select",
    defaultSelect: true
  },
  number: { type: Number, input: "Input", validType: "number", readonly: true },
  quantity: {
    type: Number,
    default: 0,
    input: "Input",
    validType: "number",
    total: "lines",
    readonly: true
  },
  amount: { type: Number, default: 0, input: "Input", validType: "currency", total: "lines", defaultSelect: true, readonly: true },
  taxAmount: { type: Number, default: 0, input: "Input", validType: "currency", total: "lines", defaultSelect: true, readonly: true },
  grossAmount: { type: Number, default: 0, input: "Input", validType: "currency", total: "lines", defaultSelect: true, readonly: true },
  weight: { type: Number, default: 0, input: "Input", validType: "number", precision: 2, total: "lines", readonly: true },
  taxRate: {
    type: Number,
    default: 0,
    input: "Input",
    validType: "percent",
    precision: 1,
    min: 0
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1,
    input: "Input",
    validType: "number",
    precision: 4
  },
  currency: {
    type: String,
    required: true,
    default: "PLN",
    input: "Select",
    constant: 'currency',
    defaultSelect: true
  },
  memo: {
    type: String,
    input: "Textarea",
  },

  //addresses
  shippingAddress: { type: nestedSchema, validType: "nestedDocument", virtualPath: "addresses" },
  billingAddress: { type: nestedSchema, validType: "nestedDocument", virtualPath: "addresses" },
  shipToDifferentAddress: {
    type: Boolean,
    input: "Switch",
    validType: "switch",
    default: false,
  },

  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pendingapproval",
    constant: 'status',
  },
  taxNumber: {
    type: String,
    input: "Input",
    validType: "text",
    min: 10,
    max: 14,
    hint: "VAT registration number",
    help: "Sometimes also known as a VAT registration number, this is the unique number that identifies a taxable person (business) or non-taxable legal entity that is registered for VAT."
  },
  referenceNumber: {
    type: String,
    input: "Input",
    validType: "text",
    hint: "Order Reference Number",
    help: "Unique number that gets assigned to an order placed by the customer (online or offline)"
  },

  //classsifictaions
  group: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Group",
    autopopulate: true,
    input: "Select"
  },
  category: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
    autopopulate: true,
    input: "Select",
    validType: "select",
  },

  salesRep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
    input: "Select",
    validType: "url",
    hint: "Sales Representative",
    help: "A sales rep interacts directly with customers throughout all phases of the sales process."
  },
};
const options = {
  discriminatorKey: "type",
  collection: "transactions",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new mongoose.Schema<ITransaction>(TransactionSchema, options);
schema.virtual("lines", {
  ref: "Line",
  localField: "_id",
  foreignField: "transaction",
  justOne: false,
  autopopulate: true,
  model: Line,
  copyFields: ["entity", "account", "currency"],
  options: { sort: { index: 1 } },
});

schema.virtual('amountFormat').get(function (this) {
  if (this.amount !== undefined) {
    if (this.currency)
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.currency }).format(this.amount);
    else return this.amount.toFixed(2)
  }
});
schema.virtual('grossAmountFormat').get(function (this) {
  if (this.grossAmount !== undefined) {
    if (this.currency)
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.currency }).format(this.grossAmount);
    else return this.grossAmount.toFixed(2)
  }
});
schema.virtual('taxAmountFormat').get(function (this) {
  if (this.taxAmount !== undefined) {
    if (this.currency)
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.currency }).format(this.taxAmount);
    else return this.taxAmount.toFixed(2)
  }

});

schema.virtual("addresses", {
  ref: "Address",
  localField: "entity",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  sortable: true,
  editable: true,
  removable: true,
  addable: true,
  groupable: true,
  model: Address
});

schema.method("pdf", async function () {
  return await printPDF();
});
schema.method("autoName", async function () {
  // set new transaction name (prefix+number+sufix)

  if (!this.name) {
    //console.log(this);
    //let temp = await this.populate("company");
    //console.log(temp);
    //console.log(temp.company, temp.company.name, temp.company.tmp);
    // let format = this.company.transactionNumbers.find(
    //   (transaction: any) => transaction.type === this.type
    // );
    // if (format) {
    //   this.number = format.currentNumber;
    //   this.name = `${format.prefix || ""}${format.currentNumber}${
    //     format.sufix || ""
    //   }`;
    //   this.company.incNumber(this.type);
    // } else throw new Error("Record Type is undefined in Company record");

    this.name = `SO#${this.number}`;
  }
});
schema.method("findRelations", async function () {
  return mongoose.model("Transaction").find({ type: this.type }, (err, transactions) => {
  });
});

schema.pre("validate", async function (next) {
  console.log("transaction pre valide");
  next();
});
schema.pre("save", async function (next) {

  //billing
  if (this.billingAddress) {
    if (!this.billingAddress.latitude || !this.billingAddress.longitude || this.isModified("billingAddress.zip") || this.isModified("billingAddress.city") || this.isModified("billingAddress.country")) {
      let geoCodeHint = `${this.billingAddress.zip} ${this.billingAddress.city} ${this.billingAddress.country}`;
      const coordinate = await geocode(geoCodeHint || "");
      if (coordinate && coordinate.latitude && coordinate.longitude) {
        this.billingAddress.latitude = coordinate.latitude;
        this.billingAddress.longitude = coordinate.longitude;
      }
    }
  }

  //shipping
  if (this.shippingAddress) {
    if (!this.shippingAddress.latitude || !this.shippingAddress.longitude || this.isModified("shippingAddress.zip") || this.isModified("shippingAddress.city") || this.isModified("shippingAddress.country")) {
      let geoCodeHint = `${this.shippingAddress.zip} ${this.shippingAddress.city} ${this.shippingAddress.country}`;
      const coordinate = await geocode(geoCodeHint || "");
      if (coordinate && coordinate.latitude && coordinate.longitude) {
        this.shippingAddress.latitude = coordinate.latitude;
        this.shippingAddress.longitude = coordinate.longitude;
      }
    }
  }


  schema.method("recalc", async function () {

    console.log("recalc", "transaction")
    for (let trigger of this.$locals.triggers) {
      console.log(`${trigger.type}_${trigger.field}`)
      this.$locals.triggers.shift();
    }

    // ustawianie znaczynika adresu
    if (this.billingAddress?.name == this.shippingAddress?.name) this.shipToDifferentAddress = false
    else this.shipToDifferentAddress = true;

    if (!this.shipToDifferentAddress) {
      this.shippingAddress = this.billingAddress;
    }

  })


  await this.autoName();
});

const Transaction: ITransactionModel = mongoose.model<ITransaction, ITransactionModel>(
  "Transaction",
  schema
);
export default Transaction;


