import Changelog from "../../models/changelog.model";
import { Document, models } from 'mongoose';
import { IExtendedDocument } from "../methods"
export default async function changeLogs<T extends IExtendedDocument>(this: T, document?: any, subdoc?: string) {
  try {
    //przywraca oznaczenie zmian
    // Object.keys(this.$locals).forEach(path => {
    //   this.markModified(path)
    // })

    if (this.isModified()) {
      let selects = this.directModifiedPaths();
      //get original document if exists (only changed fields)
      //console.log(this.type, this.constructor,selects)

      const constructor: any = this.constructor;
      const createdBy = constructor.getUser();
      const type = constructor.modelName.split("_")[0];
      if (!this.isNew && this.type) {
        let originalDoc = await models[type].findById(this.id, selects);
        if (originalDoc) {
          selects.forEach((field: string) => {
            // przypisanie wartości
            let value = this;
            let originalValue = originalDoc;
            // przypisanie wartości dla nested
            field.split(".").forEach(f => {
              originalValue = originalValue[f];
              value = value[f];
            })
            // ref dla modeli
            let ref = null;
            if (this.schema.path(field) && this.schema.path(field).options.ref) {
              ref = this.schema.path(field).options.ref
            }
            this.depopulate();

            if ((value || "").toString() !== (originalValue || "").toString()) {

              let changeLog = new Changelog(
                {
                  document: document || this.id,
                  field: field,
                  subdoc: subdoc,
                  subdoc_id: subdoc ? this.id : null,
                  newValue: value,
                  oldValue: originalValue,
                  ref: ref,
                  createdBy: createdBy
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
  } catch (err) {
    console.log(err)
  }
}
