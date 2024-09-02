import * as mongoose from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function setValue(
  this: IExtendedDocument,
  field: string,
  value: any,
  subdoc: string | null = null,
  subdoc_id: string | null = null,
  deepdoc: string | null = null,
  deepdoc_id: string | null = null,
) {
  try {
    console.log("setValue");
    let document: IExtendedDocument | null = null;
    if (field) {
      let changed = false;
      if (subdoc) {
        let virtual: any = this.schema.virtuals[subdoc];
        if (virtual && !virtual.options.justOne) {
          if (!this[subdoc]) this[subdoc] = [];
          if (subdoc_id) {
            document = this[subdoc].find((element: any) => {
              return element._id.toString() === subdoc_id.toString();
            });
          }
        } else if (!this[subdoc]) { this[subdoc] = new Object() }
        if (!document) {
          if (virtual) {
            let Model = mongoose.model(virtual.options.ref)
            document = await new Model() as IExtendedDocument;
            document.initLocal();
            if (virtual.options.justOne) {
              this[subdoc] = document;
            } else {
              if (!this[subdoc]) this[subdoc] = [];
              this[subdoc].push(document);
            }
            this.validateVirtuals(false);
            if (deepdoc) return document.setValue(field, value, deepdoc, deepdoc_id, null, null)
          } else {
            document = this;

            if (((value || "").toString() !== (document[field] || "").toString()))
              this.$locals.triggers.push({ type: "setValue", name: `setValue_${subdoc}.${field}`, field: field, subdoc: subdoc, oldValue: document[subdoc][field], value: value });

            if (field !== "_id") document[subdoc][field] = value;
            await document.populate(`${subdoc}.${field}`, "name displayname type _id images");
            changed = true;
          }
        } else {
          if (virtual) this.validateVirtuals(false);

        }
      } else {
        document = this;

      }

      if (!changed) {

        if (((value || "").toString() !== (document[field] || "").toString()))
          document.$locals.triggers.push({ type: "setValue", name: `setValue_${field}`, field: field, oldValue: document[field], value: value });
        if (field !== "_id") document[field] = value;
        //populate new field value
        await document.autoPopulate()
        //await document.populate(field, "name displayname type _id images");

      }
    } else {
      throw "Update: field is required!"
    }
    if (document) {
      await document.recalcDocument();
      return document;
    }


  } catch (err) {
    console.log("setValue", err)
    throw err;
  }
}

