import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
export interface IEmail extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    name: string;
    type: string;
    description: string;
    domain: string;
    entity: Schema.Types.ObjectId;
    dkim: string;
}
interface IEmailModel extends Model<IEmail>, IExtendedModel { }

export const schema = new Schema<IEmail>(
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
            default: "email"
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
            type: Schema.Types.ObjectId,
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

const Email: IEmailModel = model<IEmail, IEmailModel>("Email", schema);
export default Email;

