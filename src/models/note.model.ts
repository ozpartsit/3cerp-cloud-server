import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

export interface INote extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    name: string;
    description: string;
}
const options = {
    collection: "notes",
    type: "note"
};

interface INoteModel extends Model<INote>, IExtendedModel<INote> { }
const schema = new Schema<INote>(
    {
        user: { type: Schema.Types.ObjectId },
        name: { type: String, input: "TextField" },
        description: { type: String, input: "TextareaField" },
    },
    options
);

const Note: INoteModel = model<INote, INoteModel>("Note", schema);
export default Note;

