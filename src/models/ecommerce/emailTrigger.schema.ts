import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import EmailTemplate from "../emailTemplate.model.js";

export interface IEmailTrigger extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    webshop: mongoose.Schema.Types.ObjectId;
    type: string;
    email: mongoose.Schema.Types.ObjectId;
    template: mongoose.Schema.Types.ObjectId;
    cc: string;
    bcc: string;
    replyTo: string;
    language: string;
    trigger: string;
}
interface IEmailTriggerModel extends mongoose.Model<IEmailTrigger>, IExtendedModel<IEmailTrigger> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const EmailTriggerSchema = {
    webshop: { type: mongoose.Schema.Types.ObjectId },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Email",
        autopopulate: true,
        input: "Select"
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmailTemplate",
        autopopulate: true,
        input: "Select"
    },
    language: {
        type: String,
        default: "en",
        input: "Select",
        constant: 'language',
        defaultSelect: true,
    },
    trigger: {
        type: String,
        input: "Select",
        constant: 'trigger',
        defaultSelect: true,
    },
    type: {
        type: String,
        required: true,
    },
    cc: {
        type: String,
        input: "Input",
        validType: "text",
    },
    bcc: {
        type: String,
        input: "Input",
        validType: "text",
    },
    replyTo: {
        type: String,
        input: "Input",
        validType: "text",
    }
}
const options = {
    discriminatorKey: "type",
    collection: "websites.email_triggers",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IEmailTrigger>(EmailTriggerSchema, options);
const EmailTrigger: IEmailTriggerModel = mongoose.model<IEmailTrigger, IEmailTriggerModel>(
    "EmailTrigger",
    schema
);
EmailTrigger.init().then(function (Event) {
    new EmailTemplate()
    console.log('EmailTrigger Builded');
})
export default EmailTrigger;