import Changelog from "../../models/changelog.model";
import { Document, models } from 'mongoose';
import { IExtendedDocument } from "../methods"
export default async function changeLogs<T extends IExtendedDocument>(this: T, document?: any, subdoc?: string) {

  //zmodyfikować by przed zapisaniem pobierało oryginalny obiekt i zapisywalo zmiany
  if (this.isModified()) {
    let selects = this.directModifiedPaths();
    //get original document if exists (only changed fields)
    //console.log(this.type, this.constructor,selects)
    const constructor: any = this.constructor;
    const type = constructor.modelName.split("_")[0];
    if (!this.isNew && this.type) {
      let originalDoc = await models[type].findById(this.id, selects);
      if (originalDoc) {
        selects.forEach((field: string) => {
          let ref = this[field] && this[field].type ? this[field].constructor.modelName : null;
          this.depopulate();
          if ((this[field]).toString() !== (originalDoc[field] || "").toString()) {
            let changeLog = new Changelog(
              {
                document: document || this.id,
                field: field,
                subdoc: subdoc,
                subdoc_id: subdoc ? this.id : null,
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
}
