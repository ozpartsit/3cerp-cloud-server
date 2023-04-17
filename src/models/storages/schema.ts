import { model, Model, Schema } from "mongoose";
import { IExtendedModel } from "../../utilities/static";
import fs from "fs";
import mime from "mime-types";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IStorage {
    //_id?: Schema.Types.ObjectId;
    name: string;
    type: string;
    path: string;
    url?: string;
    urlcomponent: string;

}
interface IStorageModel extends Model<IStorage>, IExtendedModel {
    deleteFile(path: string): any;
    updateOrInsert(doc: IStorage): any;
}
const options = {
    collection: "storages",
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
    return this.updateOne(
        { name: doc.name, path: doc.path },
        doc,
        { upsert: true },
        (err: any, result: any) => {
            if (err) throw err;
            return result;
        }
    );
};

schema.method("rename", async function (path: string) {
    this.path = path;
    let doc = this;
    fs.rename(this.path, path, function (err: any) {
        let name = path.split("/").pop();
        if (err) throw err;
        doc.name = name;
        doc.save();
        console.log("Successfully renamed - AKA moved!");
    });
});
schema.static("deleteFile", async function (path: string) {
    let model = this;
    fs.unlink(path, function (err: any) {
        if (err) throw err;
        model.deleteOne({ path: path });
        console.log("Successfully removed!");
    });
});
schema.static("addFile", async function (files: any, path: string) {
    for (let file of files) {
        let name = file.name;
        file.mv(path, function (err) {
            if (err) throw err;
        });
        let doc = new this({
            name: name,
            type: mime.lookup(name).toString(),
            path: path,
            urlcomponent: encodeURI(`${path}/${name}`)
        });
        doc.save();
    }
});

const Storage: IStorageModel = model<IStorage, IStorageModel>("Storage", schema);
export default Storage;
