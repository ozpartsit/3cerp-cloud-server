import setValue from "./methods/setValue";
import getOptions from "./methods/getOptions";
import changeLogs from "./methods/changeLogs";
import virtualPopulate from "./methods/virtualPopulate";
import autoPopulate from "./methods/autoPopulate";
import constantTranslate from "./methods/constantTranslate";
import validateVirtuals from "./methods/validateVirtuals";
import totalVirtuals from "./methods/totalVirtuals";
import addToVirtuals from "./methods/addToVirtuals";
import cache from "../config/cache";
import mongoose, { Schema, Document } from "mongoose";
import { IExtendedModel } from "../utilities//static";

export interface IExtendedDocument extends Document {
  account: Schema.Types.ObjectId;
  deleted: boolean;
  resource: string;
  type: string;
  setValue: (field: string, value: any, subdoc: string, subdoc_id: string) => Promise<void>;
  getOptions: (field: string, subdoc: string, subdoc_id: string, deepdoc: string, deepdoc_id: string, page: number , keyword: string) => Promise<any>;
  changeLogs: (document?: any, list?: string) => Promise<void>;
  virtualPopulate: () => Promise<void>;
  autoPopulate: () => Promise<Object>;
  constantTranslate: (local: string) => Object;
  validateVirtuals: (save: boolean) => Promise<[any]>;
  totalVirtuals: () => void;
  addToVirtuals: () => void;
  recalcDocument: () => void;
  saveDocument: () => Promise<any>;
  validateDocument: () => Promise<[any]>;
  initLocal: () => void;
}



export default function customMethodsPlugin<T extends IExtendedDocument>(schema: Schema<T>) {
  // apply method to pre
  function recalcDocument(this: T) {
    console.log("default recalc Record");

  }
  schema.method('setValue', setValue);
  schema.method('getOptions', getOptions);
  schema.method('changeLogs', changeLogs);
  schema.method('virtualPopulate', virtualPopulate);
  schema.method('autoPopulate', autoPopulate);
  schema.method('constantTranslate', constantTranslate);
  schema.method('validateVirtuals', validateVirtuals);
  schema.method('totalVirtuals', totalVirtuals);
  schema.method('addToVirtuals', addToVirtuals);
  schema.method('recalcDocument', recalcDocument);
  schema.method('initLocal', initLocal);

  schema.method('validateDocument', async function (this: T): Promise<[any]> {
    console.log("validateDocument");
    let errors: any = [];
    let err = this.validateSync();
    if (err) errors.push(err)
    let virtualmsg = await this.validateVirtuals(false);
    if (virtualmsg && virtualmsg.length) errors.push(...virtualmsg)
    return errors;
  })

  schema.method('saveDocument', async function (this: T): Promise<T> {
    console.log("save document");
    this.recalcDocument();
    await this.validateVirtuals(true);
    await this.changeLogs();
    let document = await this.save();
    cache.del(document._id.toString());

    return document;
  })



  //triggers loop
  // async function actions(this: T, next: any) {
  //   console.log("post valide ")
  //   if (this.$locals.triggers) {
  //     let triggers: any = this.$locals.triggers;
  //     for (let trigger of triggers) {
  //         await actions(trigger);

  //       // remove trigger
  //       triggers.shift();

  //       await this.validate()
  //     }
  //   }
  // }


  // add resource
  schema.virtual('resource').get(function (this: T) {
    let resources = this.collection.name.split(".")
    return resources[0];
  });

  //add locals
  async function initLocal(this: T) {
    this.$locals["oldValue"] = {};
    this.$locals["triggers"] = [];
  }

  schema.pre("save", function () {
    let model: any = this.constructor;
    this.type = model.modelName.split("_")[0];
  })

  schema.pre("init", initLocal)
  // add Owner ID
  // schema.add({
  //   ownerAccount: {
  //     type: String,//Schema.Types.ObjectId,
  //     required: true,
  //   },
  // });
  // owner restriction
  //schema.pre('find', function (this:any) {
  //mongoose.connection.useDb('mo1069_backup');
  //console.log(mongoose.connection)
  // const currentUser = "test";
  // this.where({ ownerAccount: currentUser });
  //console.log(next, req,test)
  //let tmp = req();
  //console.log( this)
  //next();
  //});

}


