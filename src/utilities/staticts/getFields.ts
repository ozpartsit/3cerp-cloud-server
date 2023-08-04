import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
export default function getFields<T extends IExtendedDocument>(this: Model<T>, local?: string, parent?: string) {
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
      let field: any = {
        field: key,
        name: i18n.__(`${this.modelName.toLowerCase()}.${key}`),
        ref: value.options.ref,
        //instance: schematype.instance,
        fieldType: "Table"
      };
      if (value.options.ref) {
        let refModel: any = models[value.options.ref];
        if (!parent) field.fields = refModel.getFields(local, key);
      }
      fields.push(field)
    }
  });
  //modelSchema.eachPath(async (pathname: string, schematype: any) => {
  for (const [pathname, schematype] of Object.entries<any>(modelSchema.paths)) {

    if (
      schematype.options.input ||
      ["Embedded", "Array"].includes(schematype.instance)
    ) {
      if (["Embedded", "Array"].includes(schematype.instance)) {
        //console.log('sd', pathname,JSON.stringify(schematype));
        let field: any = {
          field: parent ? `${parent}.${pathname}` : pathname,
          name: i18n.__(`${this.modelName.toLowerCase()}.${pathname}`),
          fieldType: `${schematype.instance}Field`,
          fields: []
        }
        if (!parent) for (const [key, value] of Object.entries<any>(schematype.schema.tree)) {

          let subfield = {
            field: `${pathname}.${key}`,
            name: i18n.__(`${pathname}.${key}`),
            required: value.required,
            ref: value.ref,
            resource: value.resource,
            constant: value.constant,
            fieldType: value.input
          }
          if (value.input)
            field.fields.push(subfield)
        }
        fields.push(field);
      } else {
        i18n.setLocale(local || "en");

        let field: any = {
          field: parent ? `${parent}.${pathname}` : pathname,
          name: i18n.__(`${this.modelName.toLowerCase()}.${pathname}`),
          required: schematype.isRequired,
          ref: schematype.options.ref,
          resource: schematype.options.resource,
          constant: schematype.options.constant,
          fieldType: schematype.options.input,
          select: schematype.options.select,
          selects: schematype.options.autopopulate ? schematype.options.autopopulate.select : "",
        }

        if (schematype.options.ref) {
          let refModel: any = models[schematype.options.ref];
          if (refModel) {
            field.resource = refModel.schema.options.collection;
            if (!parent) field.fields = refModel.getFields(local, pathname);
          }
        }
        if (field.type != "subrecords") fields.push(field);
      }
    }
  }
  //});
  //if (!parent) console.log(fields);
  return fields;
}


