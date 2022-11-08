export default async function addToVirtuals(
  this: any,
  virtual: string,
  newline: any,
  index: number
) {
  newline = new this.schema.virtuals[virtual].options.model(newline);
  this[virtual].splice(index, 0, newline);
}
