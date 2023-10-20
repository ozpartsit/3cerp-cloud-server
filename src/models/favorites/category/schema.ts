import { Schema, Model, model } from "mongoose";
import Favorites, { IFavorites } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface ICategory extends IFavorites {
    _id: Schema.Types.ObjectId

}
export interface ICategoryModel extends Model<ICategory>, IExtendedModel<ICategory> { }

export const schema = new Schema<ICategory>({}, options);

schema.virtual("links", {
    ref: "FavoriteLink",
    localField: "_id",
    foreignField: "category",
    justOne: false,
    autopopulate: true,
    //defaultSelect: true,
    copyFields: ["account", "user"],
    options: { sort: { index: 1 } },
});
schema.index({ name: 1 });

const Category: ICategoryModel = Favorites.discriminator<ICategory, ICategoryModel>(
    "FavoriteCategory",
    schema
);
export default Category;