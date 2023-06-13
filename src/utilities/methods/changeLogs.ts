export default async function changeLogs(this: any) {
  // init local array to hold modified paths
  let newModifiedPaths: any[] = [];
  this.$locals.modifiedPaths = this.$locals.modifiedPaths || {};

  // this.directModifiedPaths().forEach((path: string) => {
  //   console.log(path)
  //   if (this.schema.path(path).options.ref) {
  //     if (
  //       (this.$locals.modifiedPaths[path]
  //         ? (
  //           this.$locals.modifiedPaths[path]._id ||
  //           this.$locals.modifiedPaths[path]
  //         ).toString()
  //         : null) !==
  //       (this[path] ? (this[path]._id || this[path]).toString() : null)
  //     ) {
  //       newModifiedPaths.push({
  //         field: path,
  //         value: this[path] ? (this[path]._id || this[path]).toString() : null,
  //         oldValue: this.$locals.modifiedPaths[path]
  //           ? (
  //             this.$locals.modifiedPaths[path]._id ||
  //             this.$locals.modifiedPaths[path]
  //           ).toString()
  //           : null
  //       });
  //     }
  //   } else {
  //     if (this.$locals.modifiedPaths[path] !== this[path]) {
  //       newModifiedPaths.push({
  //         field: path,
  //         value: this[path],
  //         oldValue: this.$locals.modifiedPaths[path]
  //       });
  //     }
  //   }

  //   this.$locals.modifiedPaths[path] = this[path];
  // });

  //zmodyfikować by przed zapisaniem pobierało oryginalny obiekt i zapisywalo zmiany
  if (this.isModified) {
    let selects = this.directModifiedPaths();
    //get original document if exists (only changed fields)
    let originalDoc = await this.constructor.findById(this.id, selects);
    if (originalDoc) {
      selects.forEach((field: string) => {
        this.depopulate();
        if ((this[field]).toString() !== (originalDoc[field]).toString()) {
          //let changeLog = new ChangeLog(this.id, this[field], originalDoc[field])
        } else {
          this.unmarkModified(field);
        }

      })
    }
  }
  return newModifiedPaths;
}
