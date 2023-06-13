export default async function addToVirtuals(
  this: any,
  virtual: string,
  newline: any,
  index: number
) {
  let list = this.schema.virtuals[virtual];
  newline = new list.options.model(newline);
  newline.initLocal();
  newline.index = index;
  newline.parent = this;
  // copy field value from parten document
  (list.options.copyFields || []).forEach((field: string) => {
    newline[field] = this[field] ? this[field]._id : this[field];
  });
  this[virtual].splice(index, 0, newline);
  await this.validateVirtuals()
}
