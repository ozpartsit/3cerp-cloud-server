import * as mongoose from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import { getFileSize } from "../../../utilities/usefull";
import mime from "mime-types";
import path from "path";
export interface IFile extends IStorage {
    size?: number;
}
export interface IFileModel extends mongoose.Model<IFile>, IExtendedModel<IFile> { }

const options = { discriminatorKey: "type", collection: "storage" };
const schema = new mongoose.Schema<IFile>({
    //size: { type: Number, set: (v: any) => getFileSize(this.path) },

}, options);


schema.virtual('fullPath').get(function () {
    if (this.path)
        return path.posix.join(process.env.APP_DOMAIN || "", "storage", this.path);
    else return undefined;
});

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
