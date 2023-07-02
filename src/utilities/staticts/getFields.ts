import { Schema, models } from "mongoose";
import i18n from "../../config/i18n";
export default function getFields(this: any, local: string, parent: string) {
  let fields: any[] = [];
  let modelSchema = this.schema;
  // this.schema.discriminators && this.schema.discriminators[type]
  //   ? this.schema.discriminators[type]
  //   : this.schema;

  interface Virtuals {
    [key: string]: any;
  }
  const virtuals: Virtuals = modelSchema.virtuals;
  Object.entries(virtuals).forEach(([key, value]) => {
    if (value && value.options.ref) {
      // fields.push({
      //   name: key,
      //   ref: value.options.ref,
      //   //instance: schematype.instance,
      //   type: "subrecords"
      // });
    }
  });
  //modelSchema.eachPath(async (pathname: string, schematype: any) => {
  for (const [pathname, schematype] of Object.entries<any>(modelSchema.paths)) {

    if (
      schematype.options.input ||
      ["Embedded", "Array"].includes(schematype.instance)
    ) {
      if (["Embedded", "Array"].includes(schematype.instance)) {
        //console.log(pathname, schematype.schema);
        // this.getFields(schematype.schema, type).forEach((field) =>
        //   fields.push({ path: pathname, ...field })
        // );
      } else {
        i18n.setLocale(local);
        let field = {
          field: parent ? `${parent}.${pathname}` : pathname,
          name: i18n.__(`${this.modelName.toLowerCase()}.${pathname}`),
          required: schematype.isRequired,
          ref: schematype.options.ref,
          resource: schematype.options.resource,
          constant: schematype.options.constant,
          type: schematype.options.input,
          select: schematype.options.select,
          fields: []
        }
        if (schematype.options.ref) {
          let refModel: any = models[schematype.options.ref];
          field.resource = refModel.schema.options.collection;
          if (!parent) field.fields = refModel.getFields(local, pathname);
        }
        if (field.type != "subrecords") fields.push(field);
      }
    }
  }
  //});
  //if (!parent) console.log(fields);
  return fields;
}


