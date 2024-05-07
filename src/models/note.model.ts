import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

export interface INote extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    name: string;
    description: string;
    index: number;
    pinned: boolean;
    document?: Schema.Types.ObjectId;
    documentType?: string;
    tags?: Schema.Types.ObjectId[];
}
const options = {
    collection: "notes",
    type: "note"
};

interface INoteModel extends Model<INote>, IExtendedModel<INote> { }
const schema = new Schema<INote>(
    {
        user: { type: Schema.Types.ObjectId, required: true, defaultSelect: true },
        name: { type: String, input: "TextField" },
        description: { type: String, defaultSelect: true, input: "TextareaField" },
        index: { type: Number, defaultSelect: true },
        pinned: { type: Boolean, default: false, defaultSelect: true },
        document: {
            type: Schema.Types.ObjectId,
            refPath: "documentType",
            autopopulate: true,
        },
        documentType: {
            type: String,
            input: "text"
        },
        tags: {
            type: [Schema.Types.ObjectId],
            ref: "Tag",
            autopopulate: true,
            input: "Autocomplete"
        },
    },
    options
);

const Note: INoteModel = model<INote, INoteModel>("Note", schema);
export default Note;

