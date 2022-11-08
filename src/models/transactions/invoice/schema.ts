import { Schema, Model, model } from "mongoose";
import { ITransaction } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "transactions" };

export interface IInvoice extends ITransaction {}
export interface IInvoiceModel extends Model<IInvoice>, IExtendedModel {}

const schema = new Schema<IInvoice>({}, options);

const Invoice: IInvoiceModel = model<IInvoice, IInvoiceModel>(
  "Invoice",
  schema
);
export default Invoice;
