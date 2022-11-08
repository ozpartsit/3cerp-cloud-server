import { Schema, model } from "mongoose";
import { ICustomer } from "../customer/schema";
import TranNumbers, { ITranNumbers } from "./tranNumbers.schema";
const tranNumModel = model("TranNumbers", TranNumbers);
export interface ICompany extends ICustomer {
  transactionNumbers: ITranNumbers[];
  incNumber(): any;
}
const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICompany>({}, options);
schema.method("incNumber", async function (type: String) {
  if (this.type !== "company")
    throw new Error("Only Company Record can inc transaction numbers");
  let format = this.transactionNumbers.find(
    (transaction: any) => transaction.type === type
  );
  if (format && format.currentNumber) format.currentNumber++;
  this.save();
});
schema.virtual("transactionNumbers", {
  ref: "TranNumbers",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: tranNumModel
});
export default schema;
