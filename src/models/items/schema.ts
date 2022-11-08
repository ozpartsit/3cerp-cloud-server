import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import ItemTypes from "../../constants/item.types";
import Currencies from "../../constants/currencies";

// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IItem extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
  description?: string;
  prices?: IPrices[];
  getPrice(): any;
}
interface IItemModel extends Model<IItem>, IExtendedModel {}
interface IPrices {
  currency: string;
  price: number;
  moq: number;
}

// Schemas ////////////////////////////////////////////////////////////////////////////////

const Prices = new Schema<IPrices>({
  price: { type: Number, default: 0, required: true, input: "currency" },
  moq: { type: Number, default: 1, required: true, input: "integer" },
  currency: {
    type: String,
    //get: (v: any) => Currencies.getName(v),
    enum: Currencies,
    required: true,
    input: "select"
  }
});

const options = { discriminatorKey: "type", collection: "items" };
const schema = new Schema<IItem>(
  {
    name: { type: String, required: true, input: "text" },
    description: { type: String, input: "text", default: "" },
    type: {
      type: String,
      required: true,
      //get: (v: any) => ItemTypes.getName(v),
      enum: ItemTypes,
      input: "select"
    },
    prices: {
      type: [Prices],
      validate: [
        {
          validator: (lines: any[]) => lines.length < 10,
          msg: "Must have maximum 100 prices"
        }
      ]
    }
  },
  options
);

schema.method("getPrice", async function (line: any) {
  console.log("getPrice", line.type);
  if (line.type === "Kit Component") return 0;
  else return 1.99;
});

const Item: IItemModel = model<IItem, IItemModel>("Item", schema);
export default Item;
