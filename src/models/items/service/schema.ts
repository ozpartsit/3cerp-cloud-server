import * as mongoose from "mongoose";
import { IItem } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "items" };

export interface IService extends IItem {}
export interface IServiceModel extends mongoose.Model<IService>, IExtendedModel<IService> {}

const schema = new mongoose.Schema<IService>({}, options);

const Service: IServiceModel = mongoose.model<IService, IServiceModel>(
  "Service",
  schema
);
export default Service;
