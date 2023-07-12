import { Schema } from "mongoose";
import { IEntity } from "./schema";

export interface IContact {
  _id: Schema.Types.ObjectId;
  entity: IEntity["_id"];
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
}
const options = {
  discriminatorKey: "entity",
  collection: "entities.contacts",
  type: "contact"
};
const schema = new Schema<IContact>(
  {
    entity: { type: Schema.Types.ObjectId },
    name: { type: String, input: "TextField" },
    firstName: { type: String, input: "TextField" },
    lastName: { type: String, input: "TextField" },
    email: { type: String, input: "TextField" },
    phone: { type: String, input: "TextField" },
    jobTitle: { type: String, input: "TextField" }
  },
  options
);

export default schema;
