import EmailTemplate, { IEmailTemplateModel } from "./email/schema.js";



interface Types {
    emailtemplate: IEmailTemplateModel;

}

export const TemplateTypes: Types = {
    emailtemplate: EmailTemplate,

};
