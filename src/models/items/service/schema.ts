import { Schema, Model, model } from "mongoose";
import { IItem } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "items" };

export interface IService extends IItem {}
export interface IServiceModel extends Model<IService>, IExtendedModel {}

const schema = new Schema<IItem>({}, options);

const Service: IServiceModel = model<IService, IServiceModel>(
  "Service",
  schema
);
export default Service;
