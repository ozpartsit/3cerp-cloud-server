import setValue from "./methods/setValue";
import changeLogs from "./methods/changeLogs";
import virtualPopulate from "./methods/virtualPopulate";
import autoPopulate from "./methods/autoPopulate";
import validateVirtuals from "./methods/validateVirtuals";
import totalVirtuals from "./methods/totalVirtuals";
import addToVirtuals from "./methods/addToVirtuals";
import { cache, email } from "../app";
import mongoose, { Schema } from "mongoose";
export default function methods(schema: any, options: any) {
  // apply method to pre
  async function recalcDocument(this: any) {
    console.log("default recalc Record");

  }
  async function validateDocument(this: any) {
    console.log("validateDocument");
    let errors: any = [];
    let err = this.validateSync();
    if (err) errors.push(err)
    let virtualmsg = await this.validateVirtuals();
    if (virtualmsg && virtualmsg.length) errors.push(...virtualmsg)
    return errors;
  }
  async function saveDocument(this: any) {
    console.log("save document");
    await this.recalcDocument();
    await this.validateVirtuals(true);
    let document = await this.save();
    cache.delCache(document._id);
    this.changeLogs();
    return document;
  }

  //add locals
  async function initLocal(this: any, next: any) {
    this.$locals.oldValue = {};
    this.$locals.triggers = [];
  }

  async function actions(this: any, next: any) {
    console.log("post valide ")
    for (let trigger of this.$locals.triggers) {
      if (this.actions)
        await this.actions(trigger);

      // remove trigger
      this.$locals.triggers.shift();

      await this.validate()
    }

  }

  // add resource
  schema.virtual('resource').get(function (this: any) {
    let resources = this.schema.options.collection.split(".")
    return resources[0];
  });

  schema.methods.setValue = setValue;
  schema.methods.changeLogs = changeLogs;
  schema.methods.virtualPopulate = virtualPopulate;
  schema.methods.autoPopulate = autoPopulate;
  schema.methods.validateVirtuals = validateVirtuals;
  schema.methods.totalVirtuals = totalVirtuals;
  schema.methods.addToVirtuals = addToVirtuals;
  schema.methods.recalcDocument = recalcDocument;
  schema.methods.saveDocument = saveDocument;
  schema.methods.validateDocument = validateDocument;
  schema.methods.initLocal = initLocal;

  // schema.pre("save", handlerSave);
  // schema.pre("remove", handlerSave);
  schema.pre("init", initLocal)
  schema.post("validate", actions);


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

export interface IExtendedDocument {
  setValue(): any;
  changeLogs(): any;
  virtualPopulate(): any;
  autoPopulate(): any;
  validateVirtuals(): any;
  totalVirtuals(): any;
  addToVirtuals(): any;
  recalcRecord(): any;
}
