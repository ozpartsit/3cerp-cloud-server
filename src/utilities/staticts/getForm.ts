import * as mongoose from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
import { IExtendedModel } from "../static";
//import TablePreference from "../../models/tablePreference.model";
import asyncLocalStorage from "../../middleware/asyncLocalStorage";
import Customer from "../../models/entities/customer/schema";
export default async function getForm<T extends IExtendedDocument>(this: IExtendedModel<T>, locale: string, parent: string) {
    let modelName = this.modelName.toLowerCase().split("_")[0];
    let form = this.form();
    form = JSON.parse(JSON.stringify(form))
    if (form) {
        let fields = this.getFields(locale);


        for (let tab of form.tabs) {
            if (tab.value) tab.name = i18n.__(`${modelName.toLowerCase()}.${tab.value}`);
            if (tab.sections)
                for (let section of tab.sections) {
                    if (section.value) section.name = i18n.__(`${modelName.toLowerCase()}.${section.value}`);


                    if (section.fields) await fieldsFill(modelName, section, fields)

                    if (section.columns) {
                        for (let column of section.columns) {
                            if (column.value) column.name = i18n.__(`${modelName.toLowerCase()}.${column.value}`);
                            if (column.fields) await fieldsFill(modelName, column, fields, section.subdoc)
                        }
                    }

                    if (section.tables && section.tables.length) {
                        for (let table of section.tables) {
                            let tableObj = fields.find((field) => field.field == table.subdoc);
                            tableObj.table = `${modelName}.${table.subdoc}`;
                            //if (table) section.table.fields = table.fields;
                            Object.assign(table, tableObj);
                          
                            if (table.columns) {
                                for (let column of table.columns) {
                                    if (column.value) column.name = i18n.__(`${modelName.toLowerCase()}.${column.value}`);
                                    if (column.fields) await fieldsFill(modelName, column, fields, table.field)
                                }
                            }
                            if(table.tabels){
                                //console.log(table.tabels)
                                for (let subtable of table.tabels) {
                           
                                    let subtableObj = table.fields.find((field) => field.field == subtable.subdoc);
                                   
                                    subtableObj.table = `${tableObj.table}.${subtable.subdoc}`;
                                    Object.assign(subtable, subtableObj);
                                  
                                    if (subtable.columns) {
                                        for (let column of subtable.columns) {
                                            console.log(table.field, subtable.field)
                                            if (column.value) column.name = i18n.__(`${modelName.toLowerCase()}.${column.value}`);
                                            if (column.fields) await fieldsFill(modelName, column, fields, table.field, subtable.field)
                                        }
                                    }
                                }
                            }
                        }
                     

                    }
                }
        }
        return form;
    } else return null;

}

async function fieldsFill(modelName, section, fields, subdoc?, deepdoc?) {
    if (section.fields) for (let [index, field] of section.fields.entries()) {
        if (subdoc) {
           
            section.fields[index] = fields.find((f: any) => f.field == subdoc) || null;
            if (section.fields[index] && section.fields[index].fields && !deepdoc) section.fields[index] = section.fields[index].fields.find((f: any) => f.field == field) || null;
           // console.log(section.fields[index])
            if(deepdoc){
                section.fields[index] = section.fields[index].fields.find((f: any) => f.field == deepdoc) || null;
                if (section.fields[index] && section.fields[index].fields) section.fields[index] = section.fields[index].fields.find((f: any) => f.field == field) || null;
            }
        }
        else section.fields[index] = fields.find((f: any) => f.field == field) || null;
        if (section.fields[index]) {
            if (!["Table", "NestedDocument", "DocumentNested"].includes(section.fields[index].control)) delete section.fields[index].fields;
            delete section.fields[index].selects;
            delete section.fields[index].ref;
            if (["Table"].includes(section.fields[index].control)) {
                section.fields[index].table = `${modelName}.${section.fields[index].field}`;
                //sprawdzam czy istnieją preferencje:
                let filters = { table: `${modelName}.${section.fields[index].field}` }
                let tmpStorage: any = asyncLocalStorage.getStore();
                if (tmpStorage) {
                    filters["account"] = tmpStorage.account;
                    filters["user"] = tmpStorage.user;
                }
                const headers = await mongoose.model("Table").findOne(filters).exec()

                if (headers) {
                    section.fields[index].preference = headers._id;
                    section.fields[index].selected = headers.selected.filter(field => section.fields[index].fields.find((f: any) => f.field == field))

                }
            }
        }
    }
}