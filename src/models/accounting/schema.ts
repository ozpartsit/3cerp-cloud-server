import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IAccounting extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    name: string;
    type: string;
    description?: string;

}
interface IAccountingModel extends Model<IAccounting>, IExtendedModel { }

// Schemas ////////////////////////////////////////////////////////////////////////////////

const options = {
    discriminatorKey: "type",
    collection: "accounting",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IAccounting>(
    {
        name: { type: String, required: true, input: "text" },
        description: { type: String, input: "text", default: "" },
        type: {
            type: String,
            required: true,
        },
    },
    options
);

const Accounting: IAccountingModel = model<IAccounting, IAccountingModel>("Accounting", schema);
export default Accounting;
