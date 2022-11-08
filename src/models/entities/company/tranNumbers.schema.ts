import { Schema } from "mongoose";
import { IEntity } from "../schema";
import TranTypes from "../../../constants/transaction.types";
export interface ITranNumbers {
  _id: Schema.Types.ObjectId;
  company: IEntity["_id"];
  currency: string;
  balance: number;
  type: string;
  prefix?: string;
  sufix?: string;
  currentNumber?: number;
  initNumber?: number;
}

const options = {
  discriminatorKey: "entity",
  collection: "entities.tranNumbers"
};
const schema = new Schema<ITranNumbers>(
  {
    company: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      required: true,
      //get: (v: any) => TranTypes.getName(v),
      enum: TranTypes
    },
    prefix: { type: String, input: "text" },
    sufix: { type: String, input: "text" },
    initNumber: { type: Number, required: true, default: 1, input: "integer" },
    currentNumber: {
      type: Number,
      required: true,
      default: 1,
      input: "integer"
    }
  },
  options
);

export default schema;
