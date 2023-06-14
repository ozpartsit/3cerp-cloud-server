import i18n from "../../config/i18n";
export default async function autoPopulate(this: any, local: string) {
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
    if (!this.populated(path.field))
      Promises.push(await this.populate(path.field, path.select));
    //console.log(path.field,this[path.field], this[path.field]._id)
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



  this.schema.eachPath(function process(pathname: string, schemaType: any) {

    //constats
    if (schemaType.options.constant) {
      //console.log(i18n.__(doc[pathname]))
      doc[pathname] = { _id: doc[pathname], name: i18n.getCatalog(local || 'en')[doc[pathname]] };
      //console.log(doc[pathname])
    }


  });
  //console.log(doc)
  return doc;

}
