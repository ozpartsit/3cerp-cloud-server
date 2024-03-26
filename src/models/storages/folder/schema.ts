import { Schema, Model, model } from "mongoose";
import Storage, { IStorage } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import fs from "fs";
import File from "../file/schema";

export interface IFolder extends IStorage {
    root: Boolean
    createFolder(): any
}
export interface IFolderModel extends Model<IFolder>, IExtendedModel<IFolder> { }

const options = { discriminatorKey: "type", collection: "storage" };
const schema = new Schema<IFolder>({
    root: { type: Boolean },

}, options);

// schema.virtual("files", {
//     ref: "File",
//     localField: "_id",
//     foreignField: "folder",
//     justOne: false,
//     autopopulate: true,
//     model: File,
// });
// schema.virtual("folders", {
//     ref: "Folder",
//     localField: "_id",
//     foreignField: "folder",
//     justOne: false,
//     autopopulate: true,
//     model: this,
// });

schema.methods.createFolder = async function () {
    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
};

schema.post('save', function () {
    this.createFolder();
    Storage.find({ folder: this._id }).then(res => {
        for (let file of res) {
            file.save();
        }
    })

});


const Folder: IFolderModel = Storage.discriminator<IFolder, IFolderModel>(
    "Folder",
    schema
);
export default Folder;
