import { Schema } from "mongoose";
import { IEntity } from "../schema";
import Company, { ICompany } from "../company/schema";
import { schema as File, IFile } from "../../file.model";
import { schema as Role, IRole } from "../../role.model";
import { schema as Warehouse, IWarehouse } from "../../warehouse.model";
export interface IEmployee extends IEntity {
  company: ICompany;
  jobTitle?: string;
  avatar?: IFile;
  warehouse?: IWarehouse;
  role: IRole;
}

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<IEmployee>(
  {
    jobTitle: { type: String, input: "text" },
    avatar: { type: File, input: "file" },
    warehouse: { type: Warehouse, input: "select" },
    company: { type: Company, input: "select" },
    role: { type: Role, input: "select" }
  },
  options
);
export default schema;
