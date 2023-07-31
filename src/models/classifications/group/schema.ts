import { Schema, Model, model } from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IGroup extends IClassification {

}
export interface IGroupModel extends Model<IGroup>, IExtendedModel<IGroup> { }

export const schema = new Schema<IGroup>(
    {},
    options
);
schema.index({ name: 1 });

const Group: IGroupModel = Classification.discriminator<IGroup, IGroupModel>(
    "Group",
    schema
);
export default Group;