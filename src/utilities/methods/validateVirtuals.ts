export default async function validateVirtuals(this: any, save: boolean) {
  //console.log("validateVirtuals");
  let errors: any = [];

  const virtuals: any[] = Object.values(this.schema.virtuals);
  for (let list of virtuals) {
    if (list.options.ref && !list.options.justOne) {
      if (this[list.path] && this[list.path].length) {
        for (const [index, value] of this[list.path].entries()) {
          let line = value;
          // set index - useful to sort
          line.index = index;
          // if line is new init new document
          if (!line.schema) line = new list.options.model(line);
          // assign foreignField to documents from virtual field
          line[list.options.foreignField] = this[list.options.localField];
          // assign temporarily this to parent key
          line.parent = this;
          // copy field value from parten document
          (list.options.copyFields || []).forEach((field: string) => {
            line[field] = this[field] ? this[field]._id : this[field];
          });
          console.log("save", save);
          // Validate or validate and save
          if (save) {
            // before save validate is automatic
            if (line.deleted) await line.remove();
            else await line.save();
          } else {
            // Catch errors from validate all virtual list
            let error = await line.validate();
            if (error) errors.push(error);
          }
          //await line.autoPopulate();
          this[list.path][index] = line;
        }
      } else {
        this[list.path] = [];
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(errors);
  }
}
