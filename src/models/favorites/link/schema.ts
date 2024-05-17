import * as mongoose from "mongoose";
import Favorites, { IFavorites } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface ILink extends IFavorites {
    _id: mongoose.Schema.Types.ObjectId
    index: number
    link?: string
    category: mongoose.Schema.Types.ObjectId
    document?: mongoose.Schema.Types.ObjectId;
    documentType?: string;
}
export interface ILinkModel extends mongoose.Model<ILink>, IExtendedModel<ILink> { }

export const schema = new mongoose.Schema<ILink>(
    {
        index: { type: Number, defaultSelect: true },
        link: {
            type: String,
            required: false,
            input: "TextField",
            defaultSelect: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "FavoriteCategory",
            defaultSelect: true,
            input: "SelectField",
            copy: "_id"
        },
        document: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "documentType",
            autopopulate: true,
        },
        documentType: {
            type: String,
            input: "text"
        },
    },
    options
);
schema.index({ name: 1 });

const Link: ILinkModel = Favorites.discriminator<ILink, ILinkModel>(
    "FavoriteLink",
    schema
);
export default Link;