import { models, Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function setValue<T extends IExtendedDocument>(
  this: T,
  field: string,
  value: any,
  subdoc: string,
  subdoc_id: string,
  deepdoc: string,
  deepdoc_id: string,
) {
  try {
    let document: T;
    if (subdoc) {
      let virtual: any = this.schema.virtuals[subdoc];
      document = this[subdoc].find((element: any) => {
        return element._id.toString() === subdoc_id;
      });
      if (deepdoc) {
        subdoc = deepdoc;
        if (!document) throw 'bład'
        else {
          let parent = document;
          virtual = parent.schema.virtuals[subdoc];
          document = parent[subdoc].find((element: any) => {
            return element._id.toString() === deepdoc_id;
          });
        }
      }
      if (!document) {
        if (virtual) {
          document = await new models[virtual.options.ref]();
          document.initLocal();
          if (virtual.options.justOne) {
            this[subdoc] = document;
          } else {
            this[subdoc].push(document);
          }

          this.validateVirtuals(false);
        } else {
          console.log(this.schema.path(subdoc))
        }
      }
    } else {
      document = this;
    }

    // document.$locals.oldValue[field] = document[field];
    // document.$locals.triggers.push({ type: "setValue", field: field, oldValue: document.$locals.oldValue[field] });


    // to do - zmienić na metode setLocalTriggers()
    document[field] = value;

    //populate new field value
    await document.populate(field, "name displayname type _id");
    await document.validate();

  } catch (err) {
    return err;
  }
}
