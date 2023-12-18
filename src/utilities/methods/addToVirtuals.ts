import { Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function addToVirtuals<T extends IExtendedDocument>(
  this: T,
  virtual: string,
  newline: any,
  index: number
) {
  let list = this.schema.virtuals[virtual];
  newline = new models[list.options.ref](newline);
  newline.initLocal();
  newline.index = index;
  // copy field value from parten document
  (list.options.copyFields || []).forEach((field: string) => {
    newline[field] = this[field] ? this[field]._id : this[field];
  });
  this[virtual].splice(index, 0, newline);
  await this.validateVirtuals(false)
}
