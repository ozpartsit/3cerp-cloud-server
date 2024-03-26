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
import asyncLocalStorage from "../middleware/asyncLocalStorage";
import mongoose, { Schema, Document, models } from "mongoose";
import { IExtendedModel } from "../utilities/static";
import { encodeURIComponentFn } from "./usefull"

export interface IExtendedDocument extends Document {
  account: Schema.Types.ObjectId;
  deleted: boolean;
  resource: string;
  type: string;
  index?: number;
  uniqNumber?: number;
  name?: string;
  shortName?: string;
  urlComponent?: string;
  $locals: { triggers: any[] }
  setValue: (field: string, value: any, subdoc: string | null, subdoc_id: string | null, deepdoc: string | null, deepdoc_id: string | null) => Promise<void>;
  getOptions: (field: string, subdoc: string, subdoc_id: string | null, deepdoc: string | null, deepdoc_id: string | null, page: number, keyword: string, mode: string | null) => Promise<any>;
  changeLogs: (document?: any, list?: string) => Promise<void>;
  virtualPopulate: () => Promise<void>;
  autoPopulate: () => Promise<any>;
  constantTranslate: (local: string) => Object;
  validateVirtuals: (save: boolean) => Promise<[any]>;
  totalVirtuals: () => void;
  addToVirtuals: (virtual: string, newline: any, index?: number) => void;
  recalcDocument: () => Promise<void>;
  recalc: () => Promise<void>;
  saveDocument: () => Promise<any>;
  validateDocument: () => Promise<[any]>;
  initLocal: () => void;
  getModel: () => any
  getUser(): any
}



export default function customMethodsPlugin<T extends IExtendedDocument>(schema: Schema<T>) {
  // apply method to pre
  async function recalcDocument(this: T) {
    if (this.type && this.recalc) {
      await this.recalc()
    }
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

  schema.method('getModel', function (this: T) {
    let model: any = this.constructor;
    return model;
  })
  schema.method('getUser', function (this: T) {
    let tmpStorage = asyncLocalStorage.getStore();
    if (tmpStorage) return tmpStorage.user;
    else null;
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
    if (this.collection) {
      let resources = this.collection.name.split(".")
      return resources[0];
    }
  });

  //add locals
  async function initLocal(this: T) {
    this.$locals["triggers"] = [];
  }


  schema.pre("save", async function (this: T, next) {
    // ustawia typ na podstawie konstruktora/modelu

    let model: any = this.getModel()
    if (model.modelName) {
      const type: any = model.modelName.split("_")[0] as String;
      this.type = type;
      if (this.isNew) {
        const query: any = {
          account: this.account
        }
        const count = await models[type].countDocuments(query);
        this.uniqNumber = count + 1;
      }

      if (!this.urlComponent && this.name) {
        this.urlComponent = `${this.uniqNumber}-${encodeURIComponentFn(this.shortName || this.name)}`
      }
    }
    next()
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

