import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

export interface INote extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    index: number;
    pinned: boolean;
    document?: mongoose.Schema.Types.ObjectId;
    documentType?: string;
    tags?: mongoose.Schema.Types.ObjectId[];
}
const options = {
    collection: "notes",
    type: "note"
};

interface INoteModel extends mongoose.Model<INote>, IExtendedModel<INote> { }
const schema = new mongoose.Schema<INote>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, input: "Autocomplete", validType: "select", required: true, ref: "User", autopopulate: true, defaultSelect: true },
        name: { type: String, input: "TextField" },
        description: { type: String, defaultSelect: true, input: "TextareaField" },
        index: { type: Number, defaultSelect: true },
        pinned: { type: Boolean, default: false, defaultSelect: true },
        document: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "documentType",
            autopopulate: true,
        },
        documentType: {
            type: String,
            input: "text"
        },
        tags: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Tag",
            autopopulate: true,
            input: "Autocomplete",
            defaultSelect: true
        },
    },
    options
);

const Note: INoteModel = mongoose.model<INote, INoteModel>("Note", schema);
export default Note;

