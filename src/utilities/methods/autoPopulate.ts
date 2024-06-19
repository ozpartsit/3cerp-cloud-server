import * as mongoose from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function autoPopulate(this: IExtendedDocument, local: string) {
  let paths: any[] = [];
  //console.log("autoPopulate");
  //console.log(this.schema.path('filters.value').options.refPath);

  for (const [pathname, schemaType] of Object.entries<any>(this.schema.paths)) {
    if (["Embedded", "Array"].includes(schemaType.instance)) {
      if ((schemaType.options.ref || schemaType.options.refPath) || schemaType.options.autopopulate) {

        if (schemaType.instance === "Array") {
          if (this[pathname]) {
            this[pathname].forEach((e, index) => {
              if (e.value) {
                paths.push({
                  path: `${pathname}.${index}.value`,
                  select: "name displayname type _id resource path deleted color",
                  model: e.ref,
                  index: index
                });
              } else {
                paths.push({
                  path: pathname,
                  select: schemaType.options.autopopulate.select || "name displayname type _id resource path deleted color"
                });
              }
            });
            if (schemaType.schema) for (const [key, value] of Object.entries<any>(schemaType.schema.tree)) {

              this[pathname].forEach((element, index) => {
                if (Array.isArray(element[key])) {

                  element[key].forEach((e, index2) => {
                    if (e.value) {
                      paths.push({
                        path: `${pathname}.${index}.${key}.${index2}.value`,
                        select: "name displayname type _id resource path deleted color",
                        model: e.ref,
                        index: index
                      });
                    } else {
                      paths.push({
                        path: pathname,
                        select: schemaType.options.autopopulate.select || "name displayname type _id resource path deleted color"
                      });
                    }
                  });
                }
              })
            }
          }
        }
      }
    } else {
      // if (pathname === "_id") return;
      if ((schemaType.options.ref || schemaType.options.refPath) && schemaType.options.autopopulate) {
        paths.push({
          path: pathname,
          select: schemaType.options.autopopulate.select || "name displayname type _id resource path deleted color"
        });
      }
    }


  }

  let Promises: any[] = [];
  for (let path of paths) {
    //console.log("path", path,this[path.path] )
    if ((this[path.path] && !this[path.path].type) || !this[path.path]) // to do - poprawić
      Promises.push(this.populate(path));
  }
  //console.log("Promises1",Promises[0])
  await Promise.all(Promises);

  let doc = this//this.toObject({ getters: true, virtuals: true });
  // Virtuals
  const virtuals: any[] = Object.values(this.schema.virtuals);

  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate) {
      if (Array.isArray(this[list.path])) {
        for (let index in doc[list.path]) {
          if (!doc[list.path][index].schema) {
            delete doc[list.path][index]._id;
            let Model = mongoose.model(list.options.ref)
            doc[list.path][index] = new Model(doc[list.path][index])
          }
          doc[list.path][index] = this[list.path][index].autoPopulate()
        }
        doc[list.path] = await Promise.all(doc[list.path])
      }
    }
  }

  return doc;

}
