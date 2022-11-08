import { Schema, models } from "mongoose";
import { ILine } from "../line.schema";
const options = {
  //discriminatorKey: "type",
  collection: "transactions.lines",
  foreignField: "transaction",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

export interface ILineSalesOrder extends ILine {}
const schema = new Schema<ILineSalesOrder>({}, options);

schema.pre("validate", async function (next) {
  console.log("pre valide line SO");
  if (this.kit) {
    this.quantity = this.multiplyquantity * this.kit.quantity;
  }
  next();
});
export default schema;
