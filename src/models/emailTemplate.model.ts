import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
export interface IEmailTemplate extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    type: string;
    description: string;
    subject: string;
    html: string;
    text: string;
    trigger: string;

}
interface IEmailTemplateModel extends mongoose.Model<IEmailTemplate>, IExtendedModel<IEmailTemplate> { }

export const schema = new mongoose.Schema<IEmailTemplate>(
    {
        name: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        type: {
            type: String,
            required: true,
            default: "EmailTemplate"
        },
        trigger: {
            type: String,
            input: "Select",
            constant: 'trigger',
            defaultSelect: true,
        },
        description: {
            type: String,
            input: "Input",
            validType: "text",
        },
        subject: {
            type: String,
            input: "Input",
            validType: "text",
        },
        text: {
            type: String,
            input: "Input",
            validType: "text",
        },
        html: { type: String, input: "RichText", validType: "richText" },
    },
    {
        collection: "emails.template",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

schema.index({ name: 1 });

const EmailTemplate: IEmailTemplateModel = mongoose.model<IEmailTemplate, IEmailTemplateModel>("EmailTemplate", schema);
EmailTemplate.init().then(function (Event) {
    console.log('EmailTemplate Builded');
})
export default EmailTemplate;

