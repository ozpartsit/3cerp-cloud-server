import { Schema } from "mongoose";
import { ICustomer } from "../customer/schema";

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICustomer>({}, options);

export default schema;
