import { Schema, Model, model } from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";

export interface IFolder extends IStorage { }
export interface IFolderModel extends Model<IFolder>, IExtendedModel { }

const options = { discriminatorKey: "type", collection: "storages" };
const schema = new Schema<IFolder>({}, options);

const Folder: IFolderModel = Storage.discriminator<IFolder, IFolderModel>(
    "Folder",
    schema
);
export default Folder;
