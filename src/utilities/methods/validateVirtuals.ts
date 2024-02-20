import { Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function validateVirtuals(this: IExtendedDocument, save: boolean) {
  //console.log("validateVirtuals");
  let errors: any = [];

  const virtuals: any[] = Object.values(this.schema.virtuals);
  for (let list of virtuals) {
    if (list.options.ref) {
      if (this[list.path] && this[list.path].length) {
        // sort items before for loop
        if (list.options.options) {
          if (list.options.options.sort)
            this[list.path].sort((a: any, b: any) => a.index - b.index)
        }
        // justOne parse to Array;
        let docs: IExtendedDocument[] = this[list.path];
        if (list.options.justOne) docs = [this[list.path]];

        for (const [index, value] of docs.entries()) {
          let line = value as IExtendedDocument;
          // set index - useful to sort
          if (!list.options.justOne) line.index = index;
          // if line is new init new document
          if (!line.schema) line = new models[list.options.ref](line);
          // assign foreignField to documents from virtual field
          line[list.options.foreignField] = this[list.options.localField];
          // assign temporarily this to parent key
          // line.parent = this;
          // copy field value from parten document
          ([...(list.options.copyFields || []), "account"]).forEach((field: string) => {
            line[field] = this[field] ? this[field]._id : this[field];
          });
          // Validate or validate and save
          try {
            await line.recalcDocument();
            if (save) {
              // before save validate is automatic
              if (this.deleted) line.deleted = true;
              await line.changeLogs(this, list.path);
              if (line.deleted) await line.deleteOne();
              else await line.save();
            } else {
              // Catch errors from validate all virtual list
              //await line.validate();
            }
          } catch (err: any) {
            err._id = line._id;
            err.list = list.path;
            errors.push(err);
          }

          this[list.path][index] = line;

        }
      } else {
        this[list.path] = [];
      }
    }
    // run summary values from virtuals to main document
    this.totalVirtuals();
  }
  if (errors.length > 0) {
    if (save)
      throw errors;
    else return errors;
  }
}
