import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import { IEntity } from "../entities/schema";
//import Address from "../entities/customer/address.schema";
import { IWarehouse } from "../warehouse.model";
import Line, { ILine } from "./line.schema";

import Currencies from "../../constants/currencies";
import Countries from "../../constants/countries";
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
  taxAmount: number;
  taxNumber: string;
  referenceNumber: string;
  billingName?: string;
  billingAddressee?: string;
  billingAddress?: string;
  billingAddress2?: string;
  billingZip?: string;
  billingCity: string;
  billingState?: string;
  billingCountry: string;
  billingPhone?: string;
  billingEmail?: string;

  shippingName?: string;
  shippingAddressee?: string;
  shippingAddress?: string;
  shippingAddress2?: string;
  shippingZip?: string;
  shippingCity: string;
  shippingState?: string;
  shippingCountry: string;
  shippingPhone?: string;
  shippingEmail?: string;
  recalc(): any;
  autoName(): any;
}
interface ITransactionModel extends Model<ITransaction>, IExtendedModel { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const TransactionSchema = {
  name: { type: String, input: "text", set: (v: any) => v.toLowerCase() },
  date: { type: Date, input: "date", required: true, },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false,
    autopopulate: true,
    input: "autocomplete"
  },
  entity: {
    type: Schema.Types.ObjectId,
    ref: "Entity",
    required: true,
    autopopulate: true,
    input: "autocomplete"
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
    autopopulate: true,
    input: "autocomplete",
    default: "635fcec4dcd8d612939f7b90"
  },
  number: { type: Number, input: "number" },
  quantity: {
    type: Number,
    default: 0,
    input: "integer",
    total: "lines"
  },
  amount: { type: Number, default: 0, input: "currency", total: "lines" },
  taxAmount: { type: Number, default: 0, input: "currency", total: "lines" },
  grossAmount: { type: Number, default: 0, input: "currency", total: "lines" },
  weight: { type: Number, default: 0, input: "number" },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1,
    input: "number",
    precision: 4
  },
  currency: {
    type: String,
    required: true,
    //get: (v: any) => Currencies.getName(v),
    enum: Currencies,
    default: "PLN",
  },
  billingName: {
    type: String
  },
  billingAddressee: {
    type: String
  },
  billingAddress: {
    type: String
  },
  billingAddress2: {
    type: String
  },
  billingZip: {
    type: String
  },
  billingCity: {
    type: String
  },
  billingState: {
    type: String,
  },
  billingCountry: {
    type: String,
    enum: Countries,
  },
  billingPhone: {
    type: String
  },
  billingEmail: {
    type: String
  },
  shippingName: {
    type: String
  },
  shippingAddressee: {
    type: String
  },
  shippingAddress: {
    type: String
  },
  shippingAddress2: {
    type: String
  },
  shippingZip: {
    type: String
  },
  shippingCity: {
    type: String
  },
  shippingState: {
    type: String,
  },
  shippingCountry: {
    type: String,
    enum: Countries,
  },
  shippingPhone: {
    type: String
  },
  shippingEmail: {
    type: String
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
    i18n: true,
    enum: TranStatus
  },
  taxNumber: { type: String },
  referenceNumber: { type: String },
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
  copyFields: ["entity"]
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
    console.log(transactions);
  });
});

schema.pre("validate", async function (next) {
  console.log("pre valide");
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
