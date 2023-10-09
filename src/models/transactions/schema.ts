import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import printPDF from "../../utilities/pdf/pdf";
import Entity, { IEntity } from "../entities/schema";
import Address, { schema as AddressSchema } from "../address.model";
import Line, { ILine } from "./line.schema";


// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface ITransaction extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  type: string;
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

  recalc(): any;
  autoName(): any;
  pdf(): any;
}
interface ITransactionModel extends Model<ITransaction>, IExtendedModel<ITransaction> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const TransactionSchema = {
  name: { type: String, input: "TextField", set: (v: any) => v.toLowerCase() },
  date: { type: Date, input: "DateField", required: true, defaultSelect: true },
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
    defaultSelect: true
  },
  number: { type: Number, input: "IntField" },
  quantity: {
    type: Number,
    default: 0,
    input: "IntField",
    total: "lines"
  },
  amount: { type: Number, default: 0, input: "CurrencyField", total: "lines", defaultSelect: true },
  taxAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", defaultSelect: true },
  grossAmount: { type: Number, default: 0, input: "CurrencyField", total: "lines", defaultSelect: true },
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
    default: "PLN",
    input: "SelectField",
    constant: 'currencies',
    defaultSelect: true
  },
  memo: {
    type: String,
    input: "TextareaField"
  },
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema,
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pendingapproval",
    constant: 'statuses',
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
