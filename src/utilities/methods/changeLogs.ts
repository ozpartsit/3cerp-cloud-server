export default async function changeLogs(this: any) {
  // init local array to hold modified paths
  let newModifiedPaths: any[] = [];
  this.$locals.modifiedPaths = this.$locals.modifiedPaths || {};
  this.directModifiedPaths().forEach((path: string) => {
    if (this.schema.path(path).options.ref) {
      if (
        (this.$locals.modifiedPaths[path]
          ? (
              this.$locals.modifiedPaths[path]._id ||
              this.$locals.modifiedPaths[path]
            ).toString()
          : null) !==
        (this[path] ? (this[path]._id || this[path]).toString() : null)
      ) {
        newModifiedPaths.push({
          field: path,
          value: this[path] ? (this[path]._id || this[path]).toString() : null,
          oldValue: this.$locals.modifiedPaths[path]
            ? (
                this.$locals.modifiedPaths[path]._id ||
                this.$locals.modifiedPaths[path]
              ).toString()
            : null
        });
      }
    } else {
      if (this.$locals.modifiedPaths[path] !== this[path]) {
        newModifiedPaths.push({
          field: path,
          value: this[path],
          oldValue: this.$locals.modifiedPaths[path]
        });
      }
    }

    this.$locals.modifiedPaths[path] = this[path];
  });

  return newModifiedPaths;
}
