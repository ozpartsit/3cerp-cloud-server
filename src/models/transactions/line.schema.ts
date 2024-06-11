import * as mongoose from "mongoose";
import { IItem } from "../items/schema";
import { ITransaction } from "./schema";
import TranLineTypes from "../../constants/transaction.lines.types";
import { roundToPrecision } from "../../utilities/usefull";
import { setItem, setQuantity } from "./line.actions";

export interface ILine {
  _id: mongoose.Schema.Types.ObjectId;
  parent?: any;
  index: number;
  type: string;
  transaction: ITransaction["_id"];
  entity: ITransaction["entity"];
  account: ITransaction["account"];
  item: IItem;
  kit: mongoose.Schema.Types.ObjectId;
  description: string;
  quantity: number;
  multiplyquantity?: number;
  weight: number;
  price: number;
  amount: number;
  grossAmount: number;
  taxAmount: number;
  taxRate: number;
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
const schema = new mongoose.Schema<ILine>(
  {
    index: {
      type: Number
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction"
    },
    kit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Line"
    },
    entity: { type: mongoose.Schema.Types.ObjectId, copy: "transaction" },
    account: { type: mongoose.Schema.Types.ObjectId, copy: "transaction" },
    type: {
      type: String,
      //required: true,
      //get: (v: any) => TranLineTypes.getName(v),
      enum: TranLineTypes
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      autopopulate: { select: "name displayname type _id" },
      input: "Autocomplete",
      validType: "url"
    },
    description: {
      type: String,
      input: "Input",
      validType: "text"
    },
    price: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "currency",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    quantity: {
      type: Number,
      default: 1,
      input: "Input",
      validType: "number",
      precision: 0,
      min: 1,
      set: (v: any) => roundToPrecision(v, 0)
    },
    multiplyquantity: {
      type: Number,
      default: 1,
      input: "Input",
      validType: "number",
      precision: 0,
      readonly: true
    },
    amount: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "currency",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    taxAmount: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "currency",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    taxRate: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "percent",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    grossAmount: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "currency",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    weight: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "number",
      precision: 2,
      set: (v: any) => roundToPrecision(v, 2)
    },
    deleted: {
      type: Boolean,
      input: "Switch",
      validType: "switch",
      default: false,
      readonly: true
    }
  },
  options
);

schema.method("components", async function () {
  await this.populate("item");
  //if (this.item && this.item.type === "KitItem") this.item.getComponents(); - do poprawy
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

const Line = mongoose.model<ILine>("Line", schema);
export default Line;
