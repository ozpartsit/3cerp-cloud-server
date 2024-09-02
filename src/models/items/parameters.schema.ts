import * as mongoose from "mongoose";
import { IItem } from "./schema.js";
import { IExtendedModel } from "../../utilities/static.js";
import { IExtendedDocument } from "../../utilities/methods.js";
const options = { discriminatorKey: "type", foreignField: "item", collection: "items.parameters" };

export interface IParameter extends IExtendedDocument {
    item: IItem["_id"];
    name: string;
    value: string;
    language: string;
}
export interface IParameterModel extends mongoose.Model<IParameter>, IExtendedModel<IParameter> { }

const schema = new mongoose.Schema<IParameter>({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    name: {
        type: String,
        input: "Input",
        validType: "text"
    },
    value: {
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

const Parameter: IParameterModel = mongoose.model<IParameter, IParameterModel>(
    "Parameter",
    schema
);
export default Parameter;
