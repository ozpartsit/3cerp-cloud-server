import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

export interface IContact extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  entity: Schema.Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  description?: string;
}
const options = {
  collection: "entities.contacts",
  type: "contact"
};

interface IContactModel extends Model<IContact>, IExtendedModel<IContact> { }
const schema = new Schema<IContact>(
  {
    entity: { type: Schema.Types.ObjectId },
    name: { type: String, input: "Input", validType: "text" },
    firstName: { type: String, input: "Input", validType: "text" },
    lastName: { type: String, input: "Input", validType: "text" },
    email: { type: String, input: "Input", validType: "email" },
    phone: { type: String, input: "Input", validType: "phone" },
    jobTitle: { type: String, input: "Input", validType: "text" },
    description: { type: String, input: "Input", validType: "text" }
  },
  options
);

const Contact: IContactModel = model<IContact, IContactModel>("Contact", schema);
export default Contact;

