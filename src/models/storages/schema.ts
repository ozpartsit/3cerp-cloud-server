import * as mongoose from "mongoose";
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import fs from "fs";
import path from "path";
import Folder from "./folder/schema";
import File from "./file/schema";
import { encodeURIComponentFn } from "../../utilities/usefull"
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IStorage extends IExtendedDocument {
    name: string;
    type: string;
    path: string;
    url?: string;
    folderPath: string;
    folder: mongoose.Schema.Types.ObjectId;
    oldPath?: string;
    mime: string;
}
export interface IStorageModel extends mongoose.Model<IStorage>, IExtendedModel<IStorage> {
    deleteFile(path: string): any;
    updateOrInsert(doc: IStorage): any;
}
const options = {
    collection: "storage",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
export const schema = new mongoose.Schema<IStorage>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    path: { type: String, required: true, defaultSelect: true },
    url: { type: String, },
    folderPath: { type: String },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', autopopulate: true },
    oldPath: { type: String },
    mime: { type: String, defaultSelect: true },
}, options);

schema.statics.updateOrInsert = function (doc: IStorage) {
    try {
        return this.updateOne(
            { name: doc.name, path: doc.path },
            doc,
            { upsert: true }
        )
    } catch (err) {
        throw err;
    }

};

schema.pre('validate', async function () {
    if (this.folder) {
        await this.populate('folder');
        this.folderPath = this.folder.path;

        if (this.isModified('name') || this.isModified('folder')) {
            this.oldPath = this.path;
        }
        this.path = path.posix.join(this.folder.path, encodeURIComponentFn(this.name));
    }
});



schema.post('save', function () {
    // Sprawdzamy, czy pole "name" zostało zmodyfikowane (lub jest nowe)

    if (this.oldPath) {
        const storagePath = path.posix.resolve("storage");

        fs.rename(path.posix.join(storagePath, this.oldPath), path.posix.join(storagePath, this.path), err => {
            if (err) {
                //to do - do poprawy
                //    this.constructor.updateOne({ _id: this._id }, { $set: { path: this.oldPath } })
            }
            // this.constructor.updateOne({ _id: this._id }, { oldPath: "" }).then(res => { console.log(res) })
            //done
        })

    }
});


// schema.method("rename", async function (path: string) {
//     this.path = path;
//     let doc = this;
//     fs.rename(this.path, path, function (err: any) {
//         let name = path.split("/").pop();
//         if (err) throw err;
//         doc.name = name || "";
//         doc.save();
//         console.log("Successfully renamed - AKA moved!");
//     });
// });
schema.method("deleteFile", async function () {
    let doc = this;
    fs.unlink(this.path, function (err: any) {
        if (err) throw err;
        // doc.delete(); - do sprawdzenia
        console.log("Successfully removed!");
    });
});


const Storage: IStorageModel = mongoose.model<IStorage, IStorageModel>("Storage", schema);
export default Storage;
