import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import { IFile } from "./storages/file/schema";

export interface IEmailSent extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    type: string;
    email: Schema.Types.ObjectId;
    document?: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    ref?: string;
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    text: string;
    attachments: [IFile]
}
interface IEmailSentModel extends Model<IEmailSent>, IExtendedModel<IEmailSent> { }

export const schema = new Schema<IEmailSent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true,
        },
        type: {
            type: String,
            required: true,
            default: "EmailSent"
        },
        document: {
            type: Schema.Types.ObjectId,
            refPath: "ref",
        },
        ref: {
            type: String,
            input: "text"
        },
        email: {
            type: Schema.Types.ObjectId,
            ref: "Email",
            autopopulate: true,
            input: "select"

        },
        to: {
            type: String,
            input: "text"
        },
        cc: {
            type: String,
            input: "text"
        },
        bcc: {
            type: String,
            input: "text"
        },
        subject: {
            type: String,
            input: "text"
        },
        text: {
            type: String,
            input: "text"
        },
        attachments: {
            type: [Schema.Types.ObjectId],
            ref: "File",
            autopopulate: true,
        }
    },
    {
        collection: "emails.sent",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

schema.index({ email: 1 });

const EmailSent: IEmailSentModel = model<IEmailSent, IEmailSentModel>("EmailSent", schema);
export default EmailSent;

