import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import ItemTypes from "../../constants/item.types";
import { schema as PriceGroup, IPriceGroup } from "../classifications/pricegroup/schema";
import Price, { IPrice } from "./price.schema";
import Related from "./related.schema.js";
import Parameter from "./parameters.schema.js";
//import Countries from "../../constants/countries";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IItem extends IExtendedDocument {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  shortDescription?: string;
  prices: IPrice[];
  priceGroup: mongoose.Schema.Types.ObjectId;
  images: mongoose.Schema.Types.ObjectId[];
  coo: string;
  weight: number;
  barcode: string;
  status: string;
  manufacturer: string;
  firstSalesDate: Date;
  lastSalesDate: Date;

  //META TAGS
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  //classsifictaions
  group?: mongoose.Schema.Types.ObjectId[];
  category?: mongoose.Schema.Types.ObjectId[];
  getPrice(): any;
}
interface IItemModel extends mongoose.Model<IItem>, IExtendedModel<IItem> { }

// Schemas ////////////////////////////////////////////////////////////////////////////////

const options = {
  discriminatorKey: "type",
  collection: "items",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IItem>(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classification",
      autopopulate: true,
      required: false,
      input: "Select",
      validType: "select"
    },
    images: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Storage",
      autopopulate: { select: "path fullPath" },
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
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      autopopulate: true,
      input: "Select",
      validType: "select",
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      autopopulate: true,
      input: "Select",
      validType: "select",
    },
    //META
    metaTitle: {
      type: String,
      min: [3, "Must be at least 3 characters long, got {VALUE}"],
      input: "Input",
      validType: "text",
      help: "The <title> element typically appears as a clickable headline in search engine results"
    },
    metaDescription: {
      type: String,
      min: [3, "Must be at least 3 characters long, got {VALUE}"],
      input: "Input",
      validType: "text",
      help: "Meta description also resides in the <head> of a webpage and is commonly (though not always) displayed in a SERP snippet along with a title and page URL."
    },
    metaKeywords: {
      type: String,
      min: [3, "Must be at least 3 characters long, got {VALUE}"],
      input: "Input",
      validType: "text",
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
schema.virtual("relatedItems", {
  ref: "Related",
  localField: "_id",
  foreignField: "item",
  justOne: false,
  autopopulate: true,
  model: Related
});
schema.virtual("parameters", {
  ref: "Parameter",
  localField: "_id",
  foreignField: "item",
  justOne: false,
  autopopulate: true,
  model: Parameter
});

schema.method("getPrice", async function () {
  if (this.type === "Kit Component") return 0;
  else {
    await this.populate("prices")
    let price = this.prices.find(price => price.price);

    if (price) return price.price;
    else return 0;
  }
});

const Item: IItemModel = mongoose.model<IItem, IItemModel>("Item", schema);

Item.init().then(function (Event) {
  console.log('Item Builded');
  // Item.updateMany({ }, { $set: { account: new mongo.ObjectId('64f4cc1c9842bd71489d1fa0') } }).exec()
})
export default Item;
