import i18n from "../../config/i18n";
export default async function autoPopulate(this: any, req: any) {
  let paths: any[] = [];
  let doc = this;

  this.schema.eachPath(function process(pathname: string, schemaType: any) {
    if (pathname === "_id") return;
    if (schemaType.options.ref && schemaType.options.autopopulate) {
      paths.push({
        field: pathname,
        select: schemaType.options.autopopulate.select || "name displayname type _id resource path "
      });
    }
    //i18n Translation - test - to use only for export report
    if (schemaType.options.enum && req) {
      doc[pathname] = req.__(doc[pathname]);
    }
  });
  // Virtuals
  const virtuals: any[] = Object.values(this.schema.virtuals);
  let Promises: any[] = [];
  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate) {
      if (Array.isArray(this[list.path]))
        for (let item of this[list.path]) {
          Promises.push(item.autoPopulate());
        }
    }
  }
  for (let path of paths) {
    if (!this.populated(path.field))
      Promises.push(await this.populate(path.field, path.select));
    //console.log(path.field,this[path.field], this[path.field]._id)
  }
  await Promise.all(Promises);
}
