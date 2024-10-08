import * as mongoose from "mongoose";
import { ICustomer } from "./schema.js";
import { IExtendedModel } from "../../../utilities/static.js";
import { IExtendedDocument } from "../../../utilities/methods.js";
const options = { discriminatorKey: "type", foreignField: "item", collection: "entities.favorite" };

export interface IFavorite extends IExtendedDocument {
    customer: ICustomer["_id"];
    item: mongoose.Schema.Types.ObjectId;
    description: String;
}
export interface IFavoriteModel extends mongoose.Model<IFavorite>, IExtendedModel<IFavorite> { }

const schema = new mongoose.Schema<IFavorite>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        autopopulate: { select: "name displayname type _id description urlComponent images.path images.fullPath" },
        required: true,
        input: "Select",
        validType: "select",
        defaultSelect: true
    },
    description: {
        type: String,
        input: "Input",
        validType: "text"
    },

}, options);

const Favorite: IFavoriteModel = mongoose.model<IFavorite, IFavoriteModel>(
    "Favorite",
    schema
);
export default Favorite;
