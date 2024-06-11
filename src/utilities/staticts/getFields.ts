import * as mongoose from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
import asyncLocalStorage from "../../middleware/asyncLocalStorage";

export default function getFields<T extends IExtendedDocument>(this: mongoose.Model<T>, local: string = "en", parent: string = "", subrecord: boolean = false, table: boolean = true) {

  let tmpStorage: any = asyncLocalStorage.getStore();
  let permissions = {}
  if (tmpStorage && tmpStorage.user) {
    // to do - dodać pobieranie z bazy
    permissions = {
      items: {
        invitem: true,
        Item: true
      }
    }
  }

  const hasAccess = function (collection, type) {

    if (permissions[collection] && permissions[collection][type]) {
      return permissions[collection][type]
    } else return false
  }


  let fields: any[] = [];
  let modelSchema = this.schema;
  let modelName = this.modelName.toLowerCase().split("_")[0]
  // this.schema.discriminators && this.schema.discriminators[type]
  //   ? this.schema.discriminators[type]
  //   : this.schema;

  interface Virtuals {
    [key: string]: any;
  }
  if (table) {
    const virtuals: Virtuals = modelSchema.virtuals;
    Object.entries(virtuals).forEach(([key, value]) => {
      if (!parent && value && value.options.ref) {
        let field: any = {
          field: key,
          name: i18n.__(`${modelName}.${key}`),
          type: value.options.ref,
          //instance: schematype.instance,
          //fieldType: value.options.justOne ? "Autocomplete" : "Table",
          control: value.options.justOne ? "Autocomplete" : "Table",
          validType: value.options.validType || "table",
          //array: !value.options.justOne,
          multiple: !value.options.justOne,
          //sortable: !!value.options.sortable,
          removable: !!value.options.removable,
          addable: !!value.options.addable,
          //groupable: !!value.options.groupable,
          expandable: false,
          subdoc: true,
        };
        if (value.options.ref) {
          let refModel: any = mongoose.model(value.options.ref);
          if (refModel)
            field.fields = refModel.getFields(local, key, true);
        }
        fields.push(field)
      }
    });
  }
  //modelSchema.eachPath(async (pathname: string, schematype: any) => {
  for (const [pathname, schematype] of Object.entries<any>(modelSchema.paths)) {
    //if (schematype.options.validType) console.log(pathname, schematype.instance)
    if (
      schematype.options.input || schematype.options.ref ||
      ["Embedded", "Array"].includes(schematype.instance)
    ) {
      //console.log(schematype)
      if (["Embedded", "Array"].includes(schematype.instance)) {

        let field: any = {
          field: parent ? `${parent}.${pathname}` : pathname,
          name: i18n.__(`${modelName}.${pathname}`),
          //fieldType: schematype.instance == "Embedded" ? "DocumentNested" : schematype.options.input,
          control: schematype.instance == "Embedded" ? "DocumentNested" : schematype.options.input,
          subdoc: schematype.instance == "Embedded" ? true : false,
          //array: !!schematype['$isMongooseArray'],
          multiple: !!schematype['$isMongooseArray'],
          type: schematype.options.ref,
          resource: schematype.options.resource,
          constant: schematype.options.constant,
          validType: schematype.options.validType,
          readonly: schematype.options.readonly,
          fields: []
        }
        if (schematype.options.ref) {
          let refModel: any = mongoose.model(schematype.options.ref);
          if (refModel) {
            field.resource = refModel.schema.options.collection;
            field.type = schematype.options.ref//.toLowerCase();
            // to do - dodać sterowanie na podstawie uprawnień
            if (false)
              field.validType = "url"
          }
        }
        if (!parent && schematype.schema) for (const [key, value] of Object.entries<any>(schematype.schema.tree)) {
          let subfield = {
            field: key,
            subdoc: pathname,
            name: i18n.__(`${modelName}.${pathname}.${key}`),
            required: value.required,
            readonly: value.readonly,
            type: value.ref,
            resource: value.resource,
            constant: value.constant,
            fieldType: value.input,
            control: value.input,
            min: value.min,
            max: value.max,
            hint: value.hint,
            help: value.help,
            validType: value.validType,
            activator: value.input == "DatePicker" ? "Input" : undefined
          }
          if (schematype.options.ref) {
            let refModel: any = mongoose.model(schematype.options.ref);
            if (refModel) {
              field.resource = refModel.schema.options.collection;
            }
          }

          if (value.input)
            field.fields.push(subfield)
        }
        fields.push(field);
      } else {
        if (schematype.options.input) {
          i18n.setLocale(local || "en");

          let field: any = {
            field: schematype._presplitPath.length > 1 ? schematype._presplitPath[1] : pathname,
            name: i18n.__(`${modelName}.${pathname}`),
            subdoc: parent ? parent : false,
            //fieldType: schematype.options.input,
            control: schematype.options.input,
            //array: !!schematype['$isMongooseArray'],
            multiple: !!schematype['$isMongooseArray'],
            type: schematype.options.ref,
            resource: schematype.options.resource,
            constant: schematype.options.constant,
            sortable: true,//schematype.options.sortable,
            validType: schematype.options.validType,
            activator: schematype.options.input == "DatePicker" ? "Input" : undefined,
            groupable: false
          }
          if (!parent || subrecord || schematype._presplitPath.length > 1) {
            Object.assign(field, {
              subdoc: parent || (schematype._presplitPath.length > 1 ? schematype._presplitPath[0] : undefined),
              // subdoc_id: subrecord ? true : false,
              // subrecord: subrecord || schematype._presplitPath.length > 1,
              required: schematype.isRequired,
              readonly: schematype.options.readonly,
              min: schematype.options.min,
              max: schematype.options.max,
              hint: schematype.options.hint,
              help: schematype.options.help,
              precision: schematype.options.precision,
              activator: schematype.options.input == "DatePicker" ? "Input" : undefined
            })
          }
          if (schematype.options.ref) {
            let refModel: any = mongoose.model(schematype.options.ref);
            if (refModel) {
              field.resource = refModel.schema.options.collection;
              if (!parent) field.fields = refModel.getFields(local, pathname);
            }
          }

          // zarządzanie dostępem
          field.validType = field.validType == "url" ? hasAccess(field.resource, field.type) ? "url" : "text" : field.validType;

          if (schematype._presplitPath.length > 1) {
            let parent = fields.find(f => f.field == schematype._presplitPath[0])
            if (parent) parent.fields.push(field)
            else {
              fields.push({
                field: schematype._presplitPath[0],
                name: i18n.__(`${modelName}.${schematype._presplitPath[0]}`),
                subdoc: true,
                //fieldType: "DocumentNested",
                control: "DocumentNested",
                //array: !!schematype['$isMongooseArray'],
                multiple: !!schematype['$isMongooseArray'],
                fields: [field]
              })
            }
          } else {
            fields.push(field)
          }
          //if (field.type != "subrecords") fields.push(field);
        }
      }
    }
  }
  //});
  //if (!parent) console.log(fields);
  return sortByFieldPresence(fields, "fields").reverse()
}


function sortByFieldPresence(arr, fieldName) {
  return arr.sort((a, b) => {
    // Sprawdza, czy obiekt a ma pole fieldName
    const aHasField = a.hasOwnProperty(fieldName) ? 1 : 0;
    // Sprawdza, czy obiekt b ma pole fieldName
    const bHasField = b.hasOwnProperty(fieldName) ? 1 : 0;
    // Sortuje tak, by obiekty z polem fieldName były pierwsze
    return bHasField - aHasField;
  });
}

