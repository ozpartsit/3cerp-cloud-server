import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import { IFile } from "./storages/file/schema";

export interface IEmailSent extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    type: string;
    email: mongoose.Schema.Types.ObjectId;
    document?: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    ref?: string;
    to: string | [string];
    cc?: string | [string];
    bcc?: string | [string];
    subject: string;
    text?: string;
    attachments?: [IFile]
}
interface IEmailSentModel extends mongoose.Model<IEmailSent>, IExtendedModel<IEmailSent> { }

export const schema = new mongoose.Schema<IEmailSent>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
        },
        type: {
            type: String,
            required: true,
            default: "EmailSent"
        },
        document: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "ref",
            autopopulate: true,
        },
        ref: {
            type: String,
            input: "text",
        },
        email: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Email",
            autopopulate: true,
            input: "select",
            defaultSelect: true,

        },
        to: {
            type: [String],
            input: "text",
            set: (v: any) => !Array.isArray(v) ? [v] : v,
            defaultSelect: true,
        },
        cc: {
            type: [String],
            input: "text",
            set: (v: any) => !Array.isArray(v) ? [v] : v,
            defaultSelect: true,
        },
        bcc: {
            type: [String],
            input: "text",
            set: (v: any) => !Array.isArray(v) ? [v] : v,
            defaultSelect: true,
        },
        subject: {
            type: String,
            input: "text",
            defaultSelect: true,
        },
        text: {
            type: String,
            input: "text",
            defaultSelect: true,
        },
        attachments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "File",
            autopopulate: true,
            defaultSelect: true,
        }
    },
    {
        collection: "emails.sent",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

schema.index({ email: 1 });

const EmailSent: IEmailSentModel = mongoose.model<IEmailSent, IEmailSentModel>("EmailSent", schema);
export default EmailSent;

