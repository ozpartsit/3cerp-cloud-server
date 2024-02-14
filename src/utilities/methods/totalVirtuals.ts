import { Document } from "mongoose";
import { IExtendedDocument } from "../methods"
export default async function totalVirtuals(this: IExtendedDocument) {
  // Sum selected fields
  this.schema.eachPath((pathname: string, schematype: any) => {
    if (schematype.options.total && this[schematype.options.total]) {
      this[pathname] = 0;
      this[schematype.options.total].forEach((line: any) => {
        if (!line.deleted) this[pathname] += line[pathname] || 0;
      });
    }
  });
}
