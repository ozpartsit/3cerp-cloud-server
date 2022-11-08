import { Schema } from "mongoose";
import { IEntity } from "../schema";
import Currencies from "../../../constants/currencies";
export interface IBalance {
  _id: Schema.Types.ObjectId;
  entity: IEntity["_id"];
  company: IEntity["_id"];
  currency: string;
  balance: number;
}

const options = {
  discriminatorKey: "entity",
  collection: "entities.balances"
};
const schema = new Schema<IBalance>(
  {
    entity: { type: Schema.Types.ObjectId },
    company: { type: Schema.Types.ObjectId },
    currency: {
      type: String,
      //get: (v: any) => Currencies.getName(v),
      enum: Currencies,
      required: true,
      input: "select"
    },
    balance: { type: Number, required: true, default: 0, input: "currency" }
  },
  options
);

export default schema;
