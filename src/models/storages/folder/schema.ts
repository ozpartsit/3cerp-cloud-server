import { Schema, Model, model } from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import fs from "fs";
import File from "../file/schema";

export interface IFolder extends IStorage {
    createFolder(): any
}
export interface IFolderModel extends Model<IFolder>, IExtendedModel<IFolder> { }

const options = { discriminatorKey: "type", collection: "storages" };
const schema = new Schema<IFolder>({}, options);

schema.virtual("files", {
    ref: "File",
    localField: "_id",
    foreignField: "folder",
    justOne: false,
    autopopulate: true,
    model: File,
});
schema.virtual("folders", {
    ref: "Folder",
    localField: "_id",
    foreignField: "folder",
    justOne: false,
    autopopulate: true,
    model: this,
});

schema.methods.createFolder = async function () {
    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
};

schema.post('save', function () {
    this.createFolder();
});


const Folder: IFolderModel = Storage.discriminator<IFolder, IFolderModel>(
    "Folder",
    schema
);
export default Folder;
