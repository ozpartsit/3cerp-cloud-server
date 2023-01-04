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
    name: { type: String, input: "text" },
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    email: { type: String, input: "text" },
    phone: { type: String, input: "text" },
    jobTitle: { type: String, input: "text" }
  },
  options
);

export default schema;
