import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
export default function getFields<T extends IExtendedDocument>(this: Model<T>, local: string = "en", parent: string = "", subrecord: boolean = false) {
  let fields: any[] = [];
  let modelSchema = this.schema;
  let modelName = this.modelName.toLowerCase().split("_")[0]
  // this.schema.discriminators && this.schema.discriminators[type]
  //   ? this.schema.discriminators[type]
  //   : this.schema;

  interface Virtuals {
    [key: string]: any;
  }
  const virtuals: Virtuals = modelSchema.virtuals;
  Object.entries(virtuals).forEach(([key, value]) => {
    if (!parent && value && value.options.ref) {
      let field: any = {
        field: key,
        name: i18n.__(`${modelName}.${key}`),
        ref: value.options.ref,
        //instance: schematype.instance,
        fieldType: "Table",
        subdoc: true,
      };
      if (value.options.ref) {
        let refModel: any = models[value.options.ref];
        field.fields = refModel.getFields(local, key, true);
      }
      fields.push(field)
    }
  });
  //modelSchema.eachPath(async (pathname: string, schematype: any) => {
  for (const [pathname, schematype] of Object.entries<any>(modelSchema.paths)) {

    if (
      schematype.options.input || schematype.options.ref ||
      ["Embedded", "Array"].includes(schematype.instance)
    ) {
      if (["Embedded", "Array"].includes(schematype.instance)) {
        //console.log('sd', pathname,JSON.stringify(schematype));
        let field: any = {
          field: parent ? `${parent}.${pathname}` : pathname,
          name: i18n.__(`${modelName}.${pathname}`),
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
            fieldType: value.input,
            min: schematype.options.min,
            max: schematype.options.max,
          }
          if (value.input)
            field.fields.push(subfield)
        }
        fields.push(field);
      } else {
        i18n.setLocale(local || "en");
        let field: any = {
          field: pathname,
          name: i18n.__(`${modelName}.${pathname}`),
          fieldType: schematype.options.input,
          ref: schematype.options.ref,
          resource: schematype.options.resource,
          constant: schematype.options.constant,
        }
        if (!parent || subrecord || schematype._presplitPath.length > 1) {
          Object.assign(field, {
            subdoc: parent || (schematype._presplitPath.length > 1 ? schematype._presplitPath[0] : undefined),
            // subdoc_id: subrecord ? true : false,
            // subrecord: subrecord || schematype._presplitPath.length > 1,
            required: schematype.isRequired,
            min: schematype.options.min,
            max: schematype.options.max,
          })
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


