import { Schema, Model, model } from "mongoose";
import Favorites, { IFavorites } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface ILink extends IFavorites {
    _id: Schema.Types.ObjectId
    index: number
    link: string
    category: Schema.Types.ObjectId
}
export interface ILinkModel extends Model<ILink>, IExtendedModel<ILink> { }

export const schema = new Schema<ILink>(
    {
        index: { type: Number, defaultSelect: true },
        link: {
            type: String,
            required: true,
            input: "TextField",
            defaultSelect: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "FavoriteCategory",
            defaultSelect: true,
            input: "SelectField",
            copy: "_id"
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