import { Schema, Model, model } from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import { getFileSize } from "../../../utilities/usefull";
import mime from "mime-types";

export interface IFile extends IStorage {
    size?: number;
    mime?: string;
}
export interface IFileModel extends Model<IFile>, IExtendedModel { }

const options = { discriminatorKey: "type", collection: "storages", };
const schema = new Schema<IFile>({
    //size: { type: Number, set: (v: any) => getFileSize(this.path) },
    mime: { type: String, set: (v: any) => mime.lookup(v).toString() },
}, options);

const File: IFileModel = Storage.discriminator<IFile, IFileModel>(
    "File",
    schema
);
export default File;
