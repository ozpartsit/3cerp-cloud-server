export default async function virtualPopulate(this: any) {
  const virtuals: any[] = Object.values(this.schema.virtuals);
  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate) {
      await this.populate(list.path);
    }
  }
}
