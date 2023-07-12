import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import ItemTypes from "../../constants/item.types";
import { schema as PriceGroup, IPriceGroup } from "../classifications/pricegroup/schema";
import Price, { IPrice } from "./price.schema";
//import Countries from "../../constants/countries";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IItem extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  prices: IPrice[];
  priceGroup: Schema.Types.ObjectId;
  images: Schema.Types.ObjectId[];
  coo: string;
  weight: number;
  barcode: string;
  status: string;
  manufacturer: string;
  firstSalesDate: Date;
  lastSalesDate: Date;
  getPrice(): any;
}
interface IItemModel extends Model<IItem>, IExtendedModel { }

// Schemas ////////////////////////////////////////////////////////////////////////////////

const options = {
  discriminatorKey: "type",
  collection: "items",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IItem>(
  {
    name: { type: String, required: true, input: "TextField" },
    description: { type: String, input: "TextField", default: "" },
    type: {
      type: String,
      required: true,
      enum: ItemTypes,
      input: "SelectField"
    },
    priceGroup: {
      type: Schema.Types.ObjectId,
      ref: "Classification",
      autopopulate: true,
      required: false,
      input: "SelectField"
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Storage",
      autopopulate: true,
      input: "FileField"
    },
    coo: {
      type: String,
      input: "SelectField"
    },
    barcode: {
      type: String,
      input: "TextField"
    },
    weight: {
      type: Number,
      input: "NumberField"
    },
    status: {
      type: String,

    },
    manufacturer: {
      type: String,
      input: "TextField"
    },
    firstSalesDate: { type: Date, input: "DateField" },
    lastSalesDate: { type: Date, input: "DateField" },
  },
  options
);
schema.virtual("prices", {
  ref: "Price",
  localField: "_id",
  foreignField: "item",
  justOne: false,
  autopopulate: true,
  model: Price
});

schema.method("getPrice", async function (line: any) {
  if (line.type === "Kit Component") return 0;
  else return 1.99;
});

const Item: IItemModel = model<IItem, IItemModel>("Item", schema);
export default Item;
