import { Schema, model } from "mongoose";
import { IItem } from "../items/schema";
import { ITransaction } from "./schema";
import TranLineTypes from "../../constants/transaction.lines.types";
import { roundToPrecision } from "../../utilities/usefull";
import { setItem, setQuantity } from "./line.actions";
import { Error } from "mongoose";
export interface ILine {
  _id: Schema.Types.ObjectId;
  parent?: any;
  index: number;
  type: string;
  transaction: ITransaction["_id"];
  entity: ITransaction["entity"];
  account: ITransaction["account"];
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
  actions(trigger: any): any;
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
    account: { type: Schema.Types.ObjectId, copy: "transaction" },
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
      input: "SelectField"
    },
    description: {
      type: String,
      set: (v: any) => v.toLowerCase(),
      input: "TextField"
    },
    price: {
      type: Number,
      default: 0,
      input: "CurrencyField",
      set: (v: any) => roundToPrecision(v, 2)
    },
    quantity: {
      type: Number,
      default: 1,
      input: "IntField",
      min: 1
    },
    multiplyquantity: {
      type: Number,
      default: 1,
      input: "IntField"
    },
    amount: { type: Number, default: 0, input: "CurrencyField" },
    taxAmount: { type: Number, default: 0, input: "CurrencyField" },
    grossAmount: { type: Number, default: 0, input: "CurrencyField" },
    weight: { type: Number, default: 0, input: "NumberField" },
    deleted: { type: Boolean, default: false }
  },
  options
);

schema.method("components", async function () {
  await this.populate("item");
  if (this.item && this.item.type === "KitItem") this.item.getComponents();
});

schema.method("actions", async function (trigger) {
  console.log(`${trigger.type}_${trigger.field}`)
  switch (`${trigger.type}_${trigger.field}`) {
    case 'setValue_item':
      await setItem(this);
      break;
    case 'setValue_quantity':
      await setQuantity(this);
      break;
    default:
      console.log(`Sorry, trigger dose nto exist ${trigger.type}_${trigger.field}.`);
  }

});

schema.pre("validate", async function (next) {
  //console.log("pre valide transaction line");

  //if (this.deleted) throw new Error.ValidationError();


  // calc and set amount fields
  this.amount = roundToPrecision(this.quantity * this.price, 2);
  // tmp tax rate
  this.taxRate = 0.23;
  this.taxAmount = roundToPrecision(this.amount * this.taxRate, 2);
  this.grossAmount = roundToPrecision(this.amount + this.taxAmount, 2);

  next();
});


schema.index({ transaction: 1 });

const Line = model<ILine>("Line", schema);
export default Line;
