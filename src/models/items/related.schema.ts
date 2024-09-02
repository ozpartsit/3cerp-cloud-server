import * as mongoose from "mongoose";
import { IItem } from "./schema.js";
import { IExtendedModel } from "../../utilities/static.js";
import { IExtendedDocument } from "../../utilities/methods.js";
import Currencies from "../../constants/currencies.js";
const options = { discriminatorKey: "type", foreignField: "item", collection: "items.related" };

export interface IRelated extends IExtendedDocument {
    item: IItem["_id"];
    related: IItem;
    description: String;
    language: String;
}
export interface IRelatedModel extends mongoose.Model<IRelated>, IExtendedModel<IRelated> { }

const schema = new mongoose.Schema<IRelated>({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    related: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        autopopulate: { select: "name displayname type _id description urlComponent images.path images.fullPath" },
        required: true,
        input: "Select",
        validType: "select"
    },
    description: {
        type: String,
        input: "Input",
        validType: "text"
    },
    language: {
        type: String,
        default: "en",
        input: "Select",
        constant: 'language',
    },

}, options);

const Related: IRelatedModel = mongoose.model<IRelated, IRelatedModel>(
    "Related",
    schema
);
export default Related;
