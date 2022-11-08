import { model, Model, Schema } from "mongoose";
import { IExtendedModel } from "../utilities/static";
import fs from "fs";
import mime from "mime-types";
// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IFile {
  //_id?: Schema.Types.ObjectId;
  name: string;
  type?: string;
  path: string;
  url?: string;
  urlcomponent: string;
  size?: number;
}
interface IFileModel extends Model<IFile>, IExtendedModel {
  deleteFile(path: string): any;
  updateOrInsert(doc: IFile): any;
}

export const schema = new Schema<IFile>({
  name: { type: String, required: true, input: "text" },
  type: { type: String, required: false, input: "text" },
  path: { type: String, required: true, input: "text" },
  url: { type: String, input: "text" },
  urlcomponent: { type: String, input: "text" },
  size: { type: Number, input: "text" }
});
schema.statics.updateOrInsert = function (doc: IFile) {
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
    file.mv(`${path}/${name}`, function (err) {
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
const File: IFileModel = model<IFile, IFileModel>("File", schema);
export default File;
