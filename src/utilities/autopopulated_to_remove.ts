export default async function autoPopulateAllFields(document: any) {
  var paths: any[] = [];
  document.schema.eachPath((pathname: string, schemaType: any) => {
    if (pathname === "_id") return;
    if (schemaType.options.ref && schemaType.options.autopopulate) {
      paths.push({
        field: pathname,
        select: schemaType.options.autopopulate.select
      });
    }
  });

  for (let path of paths) {
    await document.populate(path.field, path.select);
  }
}

// function autoPopulateAllFields(schema) {
//   var paths = '';
//   schema.eachPath(function process(pathname, schemaType) {
//       if (pathname=='_id') return;
//       if (schemaType.options.ref)
//           paths += ' ' + pathname;
//   });

//   schema.pre('find', handler);
//   schema.pre('findOne', handler);

//   function handler(next) {
//       this.populate(paths);
//       next();
//   }
// };
