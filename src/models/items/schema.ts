import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import ItemTypes from "../../constants/item.types";
import { schema as PriceGroup, IPriceGroup } from "../classifications/pricegroup/schema";
import Price, { IPrice } from "./price.schema";
import Countries from "../../constants/countries";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IItem extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  prices: IPrice[];
  priceGroup: IPriceGroup;
  images: Schema.Types.ObjectId[];
  coo: string;
  weight: number;
  barcode: string;
  status: string;
  manufacturer: string;
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
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text", default: "" },
    type: {
      type: String,
      required: true,
      enum: ItemTypes,
      input: "select"
    },
    priceGroup: {
      type: PriceGroup,
      required: false,
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Storage",
      autopopulate: true,
    },
    coo: {
      type: String,
      enum: Countries,
    },
    barcode: {
      type: String,
    },
    weight: {
      type: Number,
    },
    status: {
      type: String,
    },
    manufacturer: {
      type: String,
    }
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
  console.log("getPrice", line.type);
  if (line.type === "Kit Component") return 0;
  else return 1.99;
});

const Item: IItemModel = model<IItem, IItemModel>("Item", schema);
export default Item;
