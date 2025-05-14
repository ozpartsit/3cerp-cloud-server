import { IExtendedDocument } from "../methods"
import * as mongoose from "mongoose";
export default async function virtualPopulate(this: IExtendedDocument) {
  const virtuals: any[] = Object.values(this.schema.virtuals);
  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate && !this.populated(list.path)) {
      await this.populate({ path: list.path, options: list.options.options });
      let Model = mongoose.model(list.options.ref)
      if (Model) {
        if (Array.isArray(this[list.path])) {
          for (let line of this[list.path]) {
            await line.virtualPopulate()
          }
        } else await this[list.path].virtualPopulate()
      }
    }
  }
}
