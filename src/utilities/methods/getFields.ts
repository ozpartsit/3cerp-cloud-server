import { Schema } from "mongoose";
export default async function getFields(schema: Schema, type: string) {
  let fields: any[] = [];
  //console.log(schema.virtuals);
  let modelSchema =
    schema.discriminators && schema.discriminators[type]
      ? schema.discriminators[type]
      : schema;

  interface Virtuals {
    [key: string]: any;
  }
  const virtuals: Virtuals = modelSchema.virtuals;
  Object.entries(virtuals).forEach(([key, value]) => {
    if (value && value.options.ref) {
      fields.push({
        name: key,
        ref: value.options.ref,
        //instance: schematype.instance,
        input: "subrecords"
      });
    }
  });
  modelSchema.eachPath((pathname: string, schematype: any) => {
    if (
      schematype.options.input ||
      ["Embedded", "Array"].includes(schematype.instance)
    ) {
      if (["Embedded", "Array"].includes(schematype.instance)) {
        this.getFields(schematype.schema, type).forEach((field) =>
          fields.push({ path: pathname, ...field })
        );
      } else {
        fields.push({
          name: pathname,
          required: schematype.isRequired,
          ref: schematype.options.ref,
          //instance: schematype.instance,
          input: schematype.options.input
        });
      }
    }
  });
  return fields;
}
