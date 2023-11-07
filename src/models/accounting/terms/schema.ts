import { Schema, Model, model } from "mongoose";
import Accounting, { IAccounting } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "accounting" };

export interface ITerms extends IAccounting {

}
export interface ITermsModel extends Model<ITerms>, IExtendedModel<ITerms> { }

export const schema = new Schema<ITerms>(
    {},
    options
);
schema.index({ name: 1 });

const Category: ITermsModel = Accounting.discriminator<ITerms, ITermsModel>(
    "Terms",
    schema
);
export default Category;