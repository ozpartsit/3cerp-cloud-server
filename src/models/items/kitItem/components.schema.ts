import { Schema } from "mongoose";
import { IItem } from "../schema";
export interface IComponent {
  _id: Schema.Types.ObjectId;
  item: IItem["_id"];
  component: IItem;
  description: string;
  quantity: number;
}

const options = {
  discriminatorKey: "item",
  collection: "items.components"
};
const schema = new Schema<IComponent>(
  {
    item: { type: Schema.Types.ObjectId },
    component: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      autopopulate: { select: "name displayname type _id" },
      input: "autocomplete"
    },
    description: {
      type: String,
      default: ""
    },
    quantity: { type: Number, required: true, default: 1, input: "integer" }
  },
  options
);

export default schema;
