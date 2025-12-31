import * as mongoose from "mongoose";
import { IItem } from "../items/schema";
import { ITransaction } from "./schema";
import TranLineTypes from "../../constants/transaction.lines.types";
import { roundToPrecision } from "../../utilities/usefull";
import { setItem, setQuantity } from "./line.actions";
import { IExtendedDocument } from "../../utilities/methods.js";
import { IKitItem } from "../items/kitItem/schema.js";
import util from "util";
export interface ILine extends IExtendedDocument {
  _id: mongoose.Schema.Types.ObjectId;
  index: number;
  type: string;
  transaction: ITransaction["_id"];
  entity: ITransaction["entity"];
  account: ITransaction["account"];
  item: IItem | IKitItem;
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
      autopopulate: { select: "name displayname type _id images.path images.fullPath" },
      input: "Select",
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
    },
  },
  options
);

schema.virtual('amountFormat').get(function (this: ILine & { parent(): ITransaction }) {
  if (this.parent().currency)
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.parent().currency }).format(this.amount);
  else return this.amount.toFixed(2);
});

schema.virtual('grossAmountFormat').get(function (this: ILine & { parent(): ITransaction }) {
  if (this.parent().currency)
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.parent().currency }).format(this.grossAmount);
  else return this.grossAmount.toFixed(2);
});

schema.virtual('taxAmountFormat').get(function (this: ILine & { parent(): ITransaction }) {
  if (this.parent().currency)
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.parent().currency }).format(this.taxAmount);
  else return this.taxAmount.toFixed(2);
});
schema.virtual('priceFormat').get(function (this: ILine & { parent(): ITransaction }) {
  if (this.parent().currency)
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: this.parent().currency }).format(this.price);
  else return this.price.toFixed(2);
});

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
      console.log(`Sorry, trigger dose not exist ${trigger.type}_${trigger.field}.`);
  }

});

schema.method("recalc", async function () {

  console.log("recalc", "transaction.line")
  while (this.$locals.triggers.length > 0) { // Zmieniono na while loop
    const trigger = this.$locals.triggers.shift();
    await this.actions(trigger)
  }
  // calc and set amount fields
  this.amount = roundToPrecision(this.quantity * this.price, 2);
  this.taxRate = 0.23;
  this.taxAmount = roundToPrecision(this.amount * this.taxRate, 2);
  this.grossAmount = roundToPrecision(this.amount + this.taxAmount, 2);

})


schema.pre("validate", async function (next) {
  //console.log("pre valide transaction line");

  next();
});


schema.index({ transaction: 1 });

const Line = mongoose.model<ILine>("Line", schema);
export default Line;
