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
          try {
            if (save) {
              // before save validate is automatic
              if (this.deleted) line.deleted = true;
              if (line.deleted) await line.remove();
              else await line.save();
            } else {
              // Catch errors from validate all virtual list
              await line.validate();
            }
          } catch (err: any) {
            //console.log(err)
            err._id = line._id;
            err.list = list.path;
            errors.push(err);
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
    console.log(errors.length)
    if (save)
      throw errors;
    else return errors;
  }
}
