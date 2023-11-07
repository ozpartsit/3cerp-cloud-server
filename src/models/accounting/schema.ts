import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IAccounting extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
}
interface IAccountingModel extends Model<IAccounting>, IExtendedModel<IAccounting> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const AccountingSchema = {
    name: { type: String, input: "text" },
    description: { type: String, input: "text" },
    type: {
        type: String,
        required: true,
    },
}
const options = {
    discriminatorKey: "type",
    collection: "accounting",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IAccounting>(AccountingSchema, options);
const Accounting: IAccountingModel = model<IAccounting, IAccountingModel>(
    "Accounting",
    schema
);
export default Accounting;