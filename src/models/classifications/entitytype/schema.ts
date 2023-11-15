import { Schema, Model, model } from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IEntityType extends IClassification {

}
export interface IEntityTypeModel extends Model<IEntityType>, IExtendedModel<IEntityType> { }

export const schema = new Schema<IEntityType>(
    {},
    options
);
schema.index({ name: 1 });

const EntityType: IEntityTypeModel = Classification.discriminator<IEntityType, IEntityTypeModel>(
    "EntityType",
    schema
);
export default EntityType;