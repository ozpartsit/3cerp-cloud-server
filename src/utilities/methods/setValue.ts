import { models, Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function setValue<T extends IExtendedDocument>(
  this: T,
  field: string,
  value: any,
  subdoc: string | null = null,
  subdoc_id: string | null = null,
  deepdoc: string | null = null,
  deepdoc_id: string | null = null,
) {
  try {
    console.log("setValue");
    let document: T | null = null;
    if (field) {
      let changed = false;
      if (subdoc) {

        let virtual: any = this.schema.virtuals[subdoc];
        if (virtual && !virtual.options.justOne)
          document = this[subdoc].find((element: any) => {
            return element._id.toString() === subdoc_id;
          });

        if (!document) {
          if (virtual) {
            document = await new models[virtual.options.ref]() as T;
            document.initLocal();
            if (virtual.options.justOne) {
              this[subdoc] = document;
            } else {
              this[subdoc].push(document);
            }
            this.validateVirtuals(false);
            if (deepdoc) return document.setValue(field, value, deepdoc, deepdoc_id, null, null)
          } else {
            document = this;

            if (((value || "").toString() !== (document[field] || "").toString()))
              this.$locals.triggers.push({ type: "setValue", name: `setValue_${subdoc}.${field}`, field: field, subdoc: subdoc, oldValue: document[subdoc][field], value: value });

            document[subdoc][field] = value;
            await document.populate(`${subdoc}.${field}`, "name displayname type _id");
            changed = true;
          }
        }
      } else {
        document = this;
      }


      if (!changed) {

        if (((value || "").toString() !== (document[field] || "").toString()))
          this.$locals.triggers.push({ type: "setValue", name: `setValue_${field}`, field: field, oldValue: document[field], value: value });

        document[field] = value;
        //populate new field value
        await document.populate(field, "name displayname type _id");
      }
    }
    if (document)
      await document.recalcDocument();

  } catch (err) {
    return err;
  }
}

