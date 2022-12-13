import { Schema, models } from "mongoose";
import { ILine } from "../line.schema";
const options = {
  //discriminatorKey: "type",
  collection: "transactions.lines",
  foreignField: "transaction",
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

export interface ILineSalesOrder extends ILine { }
const schema = new Schema<ILineSalesOrder>({}, options);

schema.pre("validate", async function (next) {
  console.log("pre valide line SO");
  if (this.kit) {
    console.log(this.multiplyquantity,this.kit.quantity )
    this.quantity = (this.multiplyquantity || 1) * (this.kit.quantity || 1);
  }
  next();
});
export default schema;
