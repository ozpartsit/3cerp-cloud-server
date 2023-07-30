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
  collection: "contacts",
  type: "contact"
};

interface IContactModel extends Model<IContact>, IExtendedModel<IContact> { }
const schema = new Schema<IContact>(
  {
    entity: { type: Schema.Types.ObjectId },
    name: { type: String, input: "TextField" },
    firstName: { type: String, input: "TextField" },
    lastName: { type: String, input: "TextField" },
    email: { type: String, input: "TextField" },
    phone: { type: String, input: "TextField" },
    jobTitle: { type: String, input: "TextField" },
    description: { type: String, input: "TextField" }
  },
  options
);

const Contact: IContactModel = model<IContact, IContactModel>("Contact", schema);
export default Contact;

