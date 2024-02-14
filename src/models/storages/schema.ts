import { model, Model, Schema } from "mongoose";
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import fs from "fs";
import Folder from "./folder/schema";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IStorage extends IExtendedDocument {
    name: string;
    type: string;
    path: string;
    url?: string;
    urlcomponent: string;

}
interface IStorageModel extends Model<IStorage>, IExtendedModel<IStorage> {
    deleteFile(path: string): any;
    updateOrInsert(doc: IStorage): any;
}
const options = {
    collection: "storage",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
export const schema = new Schema<IStorage>({
    name: { type: String, required: true, },
    type: { type: String, required: true },
    path: { type: String, required: true, },
    url: { type: String, },
    urlcomponent: { type: String, },
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

schema.method("rename", async function (path: string) {
    this.path = path;
    let doc = this;
    fs.rename(this.path, path, function (err: any) {
        let name = path.split("/").pop();
        if (err) throw err;
        doc.name = name || "";
        doc.save();
        console.log("Successfully renamed - AKA moved!");
    });
});
schema.method("deleteFile", async function () {
    let doc = this;
    fs.unlink(this.path, function (err: any) {
        if (err) throw err;
       // doc.delete(); - do sprawdzenia
        console.log("Successfully removed!");
    });
});


const Storage: IStorageModel = model<IStorage, IStorageModel>("Storage", schema);
export default Storage;
