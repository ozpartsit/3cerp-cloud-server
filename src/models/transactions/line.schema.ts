import { Schema, model } from "mongoose";
import { IItem } from "../items/schema";
import { ITransaction } from "./schema";
import actions from "./line.actions";
import TranLineTypes from "../../constants/transaction.lines.types";
import { roundToPrecision } from "../../utilities/usefull";
import { Error } from "mongoose";
export interface ILine {
  _id: Schema.Types.ObjectId;
  parent?: any;
  index: number;
  type: string;
  transaction: ITransaction["_id"];
  entity: ITransaction["entity"];
  warehouse: ITransaction["warehouse"];
  item: IItem;
  kit: Schema.Types.ObjectId;
  description: string;
  quantity: number;
  multiplyquantity?: number;
  weight: number;
  price?: number;
  amount: number;
  grossAmount: number;
  taxAmount: number;
  deleted: boolean;
  populate(field: string): any;
  depopulate(): any;
}

const options = {
  discriminatorKey: "parentType",
  collection: "transactions.lines",
  foreignField: "transaction",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<ILine>(
  {
    index: {
      type: Number
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    },
    kit: {
      type: Schema.Types.ObjectId,
      ref: "Line"
    },
    entity: { type: Schema.Types.ObjectId, copy: "transaction" },
    warehouse: { type: Schema.Types.ObjectId, copy: "transaction" },
    type: {
      type: String,
      //required: true,
      //get: (v: any) => TranLineTypes.getName(v),
      enum: TranLineTypes
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      autopopulate: { select: "name displayname type _id" },
      input: "autocomplete"
    },
    description: {
      type: String,
      set: (v: any) => v.toLowerCase()
    },
    price: {
      type: Number,
      default: 0,
      input: "currency",
      set: (v: any) => roundToPrecision(v, 2)
    },
    quantity: {
      type: Number,
      default: 1,
      input: "integer"
    },
    multiplyquantity: {
      type: Number,
      default: 1,
      input: "integer"
    },
    amount: { type: Number, default: 0, input: "currency" },
    taxAmount: { type: Number, default: 0, input: "currency" },
    grossAmount: { type: Number, default: 0, input: "currency" },
    weight: { type: Number, default: 0, input: "number" },
    deleted: { type: Boolean, default: false }
  },
  options
);

schema.method("components", async function () {
  await this.populate("item");
  if (this.item && this.item.type === "KitItem") this.item.getComponents();
});

schema.pre("validate", async function (next) {
  console.log("pre valide line");

  //if (this.deleted) throw new Error.ValidationError();
  let triggers: any[] = await this.changeLogs();
  for (let trigger of triggers) {
    if (actions[trigger.field]) await actions[trigger.field](this);
  }
  // calc and set amount fields
  this.amount = roundToPrecision(this.quantity * this.price, 2);
  // tmp tax rate
  this.taxRate = 0.23;
  this.taxAmount = roundToPrecision(this.amount * this.taxRate, 2);
  this.grossAmount = roundToPrecision(this.amount + this.taxAmount, 2);

  next();
});
schema.pre("save", async function (doc, next) { });

schema.index({ transaction: 1 });

const Line = model<ILine>("Line", schema);
export default Line;
