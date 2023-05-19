import setValue from "./methods/setValue";
import changeLogs from "./methods/changeLogs";
import virtualPopulate from "./methods/virtualPopulate";
import autoPopulate from "./methods/autoPopulate";
import validateVirtuals from "./methods/validateVirtuals";
import totalVirtuals from "./methods/totalVirtuals";
import addToVirtuals from "./methods/addToVirtuals";
import mongoose,{ Schema } from "mongoose";
export default function methods(schema: any, options: any) {
  // apply method to pre
  async function handler(this: any, next: any) {
    console.log("recalcRecord");
    let msg = await this.validateVirtuals();
    this.totalVirtuals();
    this.changeLogs();
    if (next) next();
    return msg;
  }
  async function handlerSave(this: any, next: any) {
    console.log("SaveRecord");
    await this.validateVirtuals(true);
    this.totalVirtuals();
    this.changeLogs();
    if (next) next();
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
  schema.methods.recalcRecord = handler;

  schema.pre("save", handlerSave);
  schema.pre("remove", handlerSave);
  //schema.pre("validate", handler);


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
