import { Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function virtualPopulate<T extends IExtendedDocument>(this: T) {
  const virtuals: any[] = Object.values(this.schema.virtuals);
  for (let list of virtuals) {
    if (list.options.ref && list.options.autopopulate) {
      await this.populate({ path: list.path, options: list.options.options });
    }
  }
}
