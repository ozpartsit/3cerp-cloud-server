import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IFavorites extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
}
interface IFavoritesModel extends Model<IFavorites>, IExtendedModel<IFavorites> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const FavoritesSchema = {
    name: { type: String, input: "text" },
    description: { type: String, input: "text" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        required: true,
    },
}
const options = {
    discriminatorKey: "type",
    collection: "favorites",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IFavorites>(FavoritesSchema, options);
const Favorites: IFavoritesModel = model<IFavorites, IFavoritesModel>(
    "Favorites",
    schema
);
export default Favorites;