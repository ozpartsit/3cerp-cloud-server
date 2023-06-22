import { Schema, Model, model } from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface ICategory extends IClassification {

}
export interface ICategoryModel extends Model<ICategory>, IExtendedModel { }

export const schema = new Schema<ICategory>(
    {},
    options
);
schema.index({ name: 1 });

const Category: ICategoryModel = Classification.discriminator<ICategory, ICategoryModel>(
    "Category",
    schema
);
export default Category;