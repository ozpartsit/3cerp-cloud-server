import { Schema, models } from "mongoose";
import { ILine } from "../line.schema";
const options = {
  //discriminatorKey: "type",
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
  console.log("pre valide line SO");
  // if (this.kit) {

  //   let kit = this.parent["lines"].find(line => line._id.toString() == this.kit.toString());
  //   if (kit)
  //     this.quantity = (this.multiplyquantity || 1) * (kit.quantity || 1);
  //   else
  //     this.deleted = true;


  // }
  next();
});
export default schema;
