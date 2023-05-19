import { Schema } from "mongoose";
import { IEntity } from "../schema";
import Company, { ICompany } from "../company/schema";
//import Storage, { IStorage } from "../../storages/schema";
import { schema as Role, IRole } from "../../role.model";
export interface IEmployee extends IEntity {
  company: ICompany;
  jobTitle?: string;
  //avatar?: IStorage;
  role: IRole;
}

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<IEmployee>(
  {
    jobTitle: { type: String, input: "text" },
    //avatar: { type: Storage, input: "file" },
    company: { type: Company, input: "select" },
    role: { type: Role, input: "select" }
  },
  options
);
export default schema;
