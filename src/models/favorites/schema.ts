import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IFavorites extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
}
interface IFavoritesModel extends mongoose.Model<IFavorites>, IExtendedModel<IFavorites> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const FavoritesSchema = {
    name: { type: String, input: "text" },
    description: { type: String, input: "text" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
const schema = new mongoose.Schema<IFavorites>(FavoritesSchema, options);
const Favorites: IFavoritesModel = mongoose.model<IFavorites, IFavoritesModel>(
    "Favorites",
    schema
);
export default Favorites;