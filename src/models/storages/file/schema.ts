import { Schema, Model, model } from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import { getFileSize } from "../../../utilities/usefull";
import mime from "mime-types";

export interface IFile extends IStorage {
    size?: number;
    mime: string;
    folderPath: string;
    folder: Schema.Types.ObjectId;
}
export interface IFileModel extends Model<IFile>, IExtendedModel<IFile> { }

const options = { discriminatorKey: "type", collection: "storage" };
const schema = new Schema<IFile>({
    //size: { type: Number, set: (v: any) => getFileSize(this.path) },
    mime: { type: String },
    folderPath: { type: String },
    folder: { type: Schema.Types.ObjectId },
}, options);

// Pre-hook wykonujący się przed zapisaniem dokumentu do bazy danych
schema.pre('save', function (next) {
    // Sprawdzamy, czy pole "name" zostało zmodyfikowane (lub jest nowe)
    if (this.isModified('name') || this.isNew) {
        // Ustawiamy pole "mime" na podstawie pola "name" z odpowiednim formatowaniem
        this.mime = mime.lookup(this.name).toString();
    }
    next();
});
const File: IFileModel = Storage.discriminator<IFile, IFileModel>(
    "File",
    schema
);
export default File;
