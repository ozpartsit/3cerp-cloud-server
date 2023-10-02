import { Schema, models } from "mongoose";
import { ILine } from "../line.schema";
const options = {
  collection: "transactions.lines",
  foreignField: "transaction",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

export interface ILineSalesOrder extends ILine {
  eta: Date;
  etaMemo: string;
}
const schema = new Schema<ILineSalesOrder>({
  eta: { type: Date },
  etaMemo: { type: String },
}, options);

schema.pre("validate", async function (next) {
  //console.log("pre valide line SO");

  next();
});
export default schema;
