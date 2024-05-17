import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

export interface IContact extends IExtendedDocument {
  _id: mongoose.Schema.Types.ObjectId;
  entity: mongoose.Schema.Types.ObjectId;
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

interface IContactModel extends mongoose.Model<IContact>, IExtendedModel<IContact> { }
const schema = new mongoose.Schema<IContact>(
  {
    entity: { type: mongoose.Schema.Types.ObjectId },
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

const Contact: IContactModel = mongoose.model<IContact, IContactModel>("Contact", schema);
export default Contact;

