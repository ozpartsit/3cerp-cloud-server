import Changelog from "../../models/changelog.model";
import { Document, models } from 'mongoose';
import { IExtendedDocument } from "../methods"
export default async function changeLogs<T extends IExtendedDocument>(this: T, document?: any, list?: string) {

  //zmodyfikować by przed zapisaniem pobierało oryginalny obiekt i zapisywalo zmiany
  if (this.isModified()) {
    let selects = this.directModifiedPaths();
    //get original document if exists (only changed fields)
    let originalDoc = models[this.constructor.name];
    originalDoc.findById(this.id, selects);
    if (originalDoc) {
      selects.forEach((field: string) => {
        let ref = this[field] && this[field].constructor ? this[field].constructor.modelName : null;

        this.depopulate();
        if ((this[field]).toString() !== (originalDoc[field]).toString()) {
          let changeLog = new Changelog(
            {
              document: document || this.id,
              field: field,
              list: list,
              record: list ? this.id : null,
              newValue: this[field],
              oldValue: originalDoc[field],
              ref: ref
            }
          );
          changeLog.save();
        } else {
          this.unmarkModified(field);
        }

      })
    }
  }
}
