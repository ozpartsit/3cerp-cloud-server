import Changelog from "../../models/changelog.model";
import { Document, models } from 'mongoose';
import { IExtendedDocument } from "../methods"
import { IExtendedModel } from "../static"
import asyncLocalStorage from "../../middleware/asyncLocalStorage";
export default async function changeLogs(this: IExtendedDocument, document?: IExtendedDocument, subdoc?: string) {
  try {
    //przywraca oznaczenie zmian
    // Object.keys(this.$locals).forEach(path => {
    //   this.markModified(path)
    // })

    if (this.isModified()) {
      let selects = this.directModifiedPaths();
      //get original document if exists (only changed fields)
      //console.log(this.type, this.constructor,selects)

      const model: any = this.getModel();
      console.log("chage log model", model)

      if (model && !this.isNew) {
        // pobieranie i ustawianie createdBy na podstawie aktualnegor requesta
        let tmpStorage: any = asyncLocalStorage.getStore();
        let createdBy = null;
        if (tmpStorage) createdBy = tmpStorage.user;


        let originalDoc = await model.findById(this.id, selects);
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
            let instance = "";
            if (this.schema.path(field)) {
              if (this.schema.path(field).options.ref)
                ref = this.schema.path(field).options.ref;
              else
                instance = this.schema.path(field).instance;
            }
            this.depopulate();
            if (instance != "Embedded") { // nie jest nestedDocuemnt
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
              }

            } else {
              this.unmarkModified(field);
            }

          })
        }
      }
    }
  } catch (err) {
    console.log("changeLogs", err)
  }
}
