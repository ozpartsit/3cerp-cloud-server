import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import printPDF from "../../utilities/pdf/pdf";
import Entity, { IEntity } from "../entities/schema";
import Address, { IAddress, nestedSchema } from "../address.model";
import Line, { ILine } from "./line.schema";


// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface ITransaction extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  type: string;
  date: Date,
  name?: string;
  number?: number;
  status?: string;
  company: IEntity["_id"];
  entity: IEntity["_id"];
  exchangeRate?: number;
  currency?: string;
  lines: ILine[];
  amount: number;
  grossAmount: number;
  tax: number;
  taxAmount: number;
  taxNumber: string;
  referenceNumber: string;
  memo: string;

  billingAddress?: IAddress
  shippingAddress?: IAddress


  recalc(): any;
  autoName(): any;
  pdf(): any;
}
interface ITransactionModel extends Model<ITransaction>, IExtendedModel<ITransaction> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const TransactionSchema = {
  name: { type: String, input: "Input", validType: "text", required: true },
  date: { type: Date, input: "DatePicker", validType: "date", required: true, defaultSelect: true },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false,
    autopopulate: true,
    input: "Select",
    validType: "select",
  },
  entity: {
    type: Schema.Types.ObjectId,
    ref: "Entity",
    required: true,
    autopopulate: true,
    input: "Autocomplete",
    validType: "autocomplete",
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
  shippingAddress: { type: nestedSchema, validType: "address", virtualPath: "addresses" },
  billingAddress: { type: nestedSchema, validType: "address", virtualPath: "addresses" },

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
};
const options = {
  discriminatorKey: "type",
  collection: "transactions",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<ITransaction>(TransactionSchema, options);
schema.virtual("lines", {
  ref: "Line",
  localField: "_id",
  foreignField: "transaction",
  justOne: false,
  autopopulate: true,
  model: Line,
  copyFields: ["entity", "account"],
  options: { sort: { index: 1 } },
});
schema.method("pdf", async function () {
  return await printPDF();
});
schema.method("autoName", async function () {
  // set new transaction name (prefix+number+sufix)
  if (!this.number) {
    //console.log(this);
    let temp = await this.populate("company");
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
    this.number = 7;
    this.name = "SO#7";
  }
});
schema.method("findRelations", async function () {
  return model("Transaction").find({ type: this.type }, (err, transactions) => {
  });
});

schema.pre("validate", async function (next) {
  console.log("transaction pre valide");
  next();
});
schema.pre("save", async function (next) {
  await this.autoName();
});

const Transaction: ITransactionModel = model<ITransaction, ITransactionModel>(
  "Transaction",
  schema
);
export default Transaction;


