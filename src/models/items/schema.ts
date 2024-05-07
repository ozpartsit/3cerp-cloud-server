import { Schema, Model, model, mongo } from "mongoose";
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

  //classsifictaions
  group?: Schema.Types.ObjectId[];
  category?: Schema.Types.ObjectId[];
  getPrice(): any;
}
interface IItemModel extends Model<IItem>, IExtendedModel<IItem> { }

// Schemas ////////////////////////////////////////////////////////////////////////////////

const options = {
  discriminatorKey: "type",
  collection: "items",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IItem>(
  {
    name: { type: String, required: true, input: "Input", validType: "text" },
    description: { type: String, input: "Input", validType: "text", default: "" },
    type: {
      type: String,
      required: true,
      enum: ItemTypes,
      input: "Select",
      validType: "select"
    },
    priceGroup: {
      type: Schema.Types.ObjectId,
      ref: "Classification",
      autopopulate: true,
      required: false,
      input: "Select",
      validType: "select"
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Storage",
      autopopulate: true,
      input: "File",
      validType: "images"
    },
    coo: {
      type: String,
      constant: "country",
      input: "Select",
      validType: "select"
    },
    barcode: {
      type: String,
      input: "Input",
      validType: "text"
    },
    weight: {
      type: Number,
      input: "Input",
      validType: "number",
      precision: 2
    },
    status: {
      type: String,
    },
    manufacturer: {
      type: String,
      input: "Input",
      validType: "text"
    },
    firstSalesDate: { type: Date, input: "DatePicker", validType: "date", readonly: true },
    lastSalesDate: { type: Date, input: "DatePicker", validType: "date", readonly: true },

    //classsifictaions
    group: {
      type: [Schema.Types.ObjectId],
      ref: "Group",
      autopopulate: true,
      input: "Autocomplete"
    },
    category: {
      type: [Schema.Types.ObjectId],
      ref: "Category",
      autopopulate: true,
      input: "Select",
      validType: "select",
    },
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

Item.init().then(function (Event) {
  console.log('Item Builded');
  // Item.updateMany({ }, { $set: { account: new mongo.ObjectId('64f4cc1c9842bd71489d1fa0') } }).exec()
})
export default Item;
