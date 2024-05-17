import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
export interface IEmail extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    type: string;
    description: string;
    domain: string;
    entity: mongoose.Schema.Types.ObjectId;
    dkim: string;
}
interface IEmailModel extends mongoose.Model<IEmail>, IExtendedModel<IEmail> { }

export const schema = new mongoose.Schema<IEmail>(
    {
        name: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "text"
        },
        type: {
            type: String,
            required: true,
            default: "Email"
        },
        description: {
            type: String,
            input: "text"
        },
        domain: {
            type: String,
            input: "text"
        },
        entity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entity",
            autopopulate: true,
            input: "select"

        },
        dkim: {
            type: String,
            input: "text"
        },
    },
    {
        collection: "emails",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

schema.index({ name: 1 });

const Email: IEmailModel = mongoose.model<IEmail, IEmailModel>("Email", schema);
export default Email;

