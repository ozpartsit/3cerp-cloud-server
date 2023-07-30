import { Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function autoPopulate<T extends IExtendedDocument>(this: T, local: string) {
  let paths: any[] = [];

  this.schema.eachPath(function process(pathname: string, schemaType: any) {
    if (pathname === "_id") return;
    if (schemaType.options.ref && schemaType.options.autopopulate) {
      paths.push({
        field: pathname,
        select: schemaType.options.autopopulate.select || "name displayname type _id resource path "
      });
    }
  });
  let Promises: any[] = [];
  for (let path of paths) {
    if (this[path.field] && !this[path.field].type) // to do - poprawić
      Promises.push(await this.populate(path.field, path.select));
  }
  await Promise.all(Promises);

  let doc = this.toObject();
  // Virtuals
  const virtuals: any[] = Object.values(this.schema.virtuals);

  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate) {
      if (Array.isArray(this[list.path])) {
        for (let index in doc[list.path]) {
          doc[list.path][index] = this[list.path][index].autoPopulate()
        }
        doc[list.path] = await Promise.all(doc[list.path])
      }
    }
  }

  return doc;

}
