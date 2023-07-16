import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import printPDF from "../../utilities/pdf/pdf";
import { IEntity } from "../entities/schema";
import Address from "../entities/address.schema";
import { IWarehouse } from "../warehouse.model";
import Line, { ILine } from "./line.schema";

import Currencies from "../../constants/currencies";
//import Countries from "../../constants/countries";
import TranTypes from "../../constants/transaction.types";
import TranStatus from "../../constants/transaction.status";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface ITransaction extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  type: string;
  name?: string;
  number?: number;
  status?: string;
  company: IEntity["_id"];
  warehouse: IWarehouse["_id"];
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
  // billingName?: string;
  // billingAddressee?: string;
  //billingAddress?: Address;
  // billingAddress2?: string;
  // billingZip?: string;
  // billingCity: string;
  // billingState?: string;
  // billingCountry: string;
  // billingPhone?: string;
  // billingEmail?: string;

  // shippingName?: string;
  // shippingAddressee?: string;
  //shippingAddress?: Address;
  // shippingAddress2?: string;
  // shippingZip?: string;
  // shippingCity: string;
  // shippingState?: string;
  // shippingCountry: string;
  // shippingPhone?: string;
  // shippingEmail?: string;
  recalc(): any;
  autoName(): any;
  pdf(): any;
}
interface ITransactionModel extends Model<ITransaction>, IExtendedModel { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const TransactionSchema = {
  name: { type: String, input: "TextField", set: (v: any) => v.toLowerCase(), select: true },
  date: { type: Date, input: "DateField", required: true, select: true },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false,
    autopopulate: true,
    input: "SelectField"
  },
  entity: {
    type: Schema.Types.ObjectId,
    ref: "Entity",
    required: true,
    autopopulate: true,
    input: "SelectField",
    select: true
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
    autopopulate: true,
    input: "SelectField",
    default: "635fcec4dcd8d612939f7b90"
  },
  number: { type: Number, input: "IntField" },
  quantity: {
    type: Number,
    default: 0,
    input: "IntField",
    total: "lines"
  },
  amount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
  taxAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
  grossAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", select: true },
  weight: { type: Number, default: 0, input: "NumberField" },
  tax: {
    type: Number,
    default: 0,
    input: "PercentField"
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1,
    input: "NumberField",
    precision: 4
  },
  currency: {
    type: String,
    required: true,
    //get: (v: any) => Currencies.getName(v),
    enum: Currencies,
    default: "PLN",
    input: "SelectField",
    resource: 'constants',
    constant: 'currencies',
    select: true
  },
  memo: {
    type: String,
    input: "TextareaField"
  },
  billingName: {
    type: String,
    input: "TextField"
  },
  billingAddressee: {
    type: String,
    input: "text"
  },
  billingAddress: Address,
  billingAddress2: {
    type: String,
    input: "text"
  },
  billingZip: {
    type: String,
    input: "text"
  },
  billingCity: {
    type: String,
    input: "text"
  },
  billingState: {
    type: String,
    input: "text"
  },
  billingCountry: {
    type: String,
    input: "select",
    resource: 'constants',
    constant: 'countries'
  },
  billingPhone: {
    type: String,
    input: "text"
  },
  billingEmail: {
    type: String,
    input: "text"
  },
  shippingName: {
    type: String,
    input: "text"
  },
  shippingAddressee: {
    type: String,
    input: "text"
  },
  shippingAddress: Address,
  shippingAddress2: {
    type: String,
    input: "text"
  },
  shippingZip: {
    type: String,
    input: "text"
  },
  shippingCity: {
    type: String,
    input: "text"
  },
  shippingState: {
    type: String,
    input: "select"
  },
  shippingCountry: {
    type: String,
    input: "select",
    resource: 'constants',
    constant: 'countries'
  },
  shippingPhone: {
    type: String,
    input: "text"
  },
  shippingEmail: {
    type: String,
    input: "text"
  },
  type: {
    type: String,
    required: true,
    //get: (v: any) => TranTypes.getName(v),
    enum: TranTypes
  },
  status: {
    type: String,
    default: "pendingapproval",
    resource: 'constants',
    constant: 'statuses',
    //enum: TranStatus,
    //input: "select",
    select: true
  },
  taxNumber: { type: String, input: "TextField" },
  referenceNumber: { type: String, input: "TextField" },
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
  copyFields: ["entity"],
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
