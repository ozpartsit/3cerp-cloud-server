import { models, Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function setValue<T extends IExtendedDocument>(
  this: T,
  field: string,
  value: any,
  list: string,
  subrecord: string,
) {
  try {
    let document: T;
    if (list) {
      document = this[list].find((element: any) => {
        return element._id.toString() === subrecord;
      });

      if (!document) {
        let virtual: any = this.schema.virtuals[list];
        document = await new models[virtual.options.ref]();
        document.initLocal();
        this[list].push(document);
        this.validateVirtuals(false);
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
