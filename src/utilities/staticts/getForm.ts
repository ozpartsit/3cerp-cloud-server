import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
import { IExtendedModel } from "../static";
//import TablePreference from "../../models/tablePreference.model";
import Customer from "../../models/entities/customer/schema";
export default async function getForm<T extends IExtendedDocument>(this: IExtendedModel<T>, locale: string, parent: string) {
    let modelName = this.modelName.toLowerCase().split("_")[0];
    let form = this.form();
    form = JSON.parse(JSON.stringify(form))
    if (form) {
        let fields = this.getFields(locale);


        for (let tab of form.tabs) {
            if (tab.value) tab.name = i18n.__(`${modelName.toLowerCase()}.${tab.value}`);

            for (let section of tab.sections) {
                if (section.value) section.name = i18n.__(`${modelName.toLowerCase()}.${section.value}`);


                if (section.fields) for (let [index, field] of section.fields.entries()) {
                    section.fields[index] = fields.find((f: any) => f.field == field) || null;
                    if (section.fields[index]) {
                        if (!["Table", "NestedDocument","DocumentNested"].includes(section.fields[index].control)) delete section.fields[index].fields;
                        delete section.fields[index].selects;
                        delete section.fields[index].ref;
                        if (["Table"].includes(section.fields[index].control)) {
                            section.fields[index].table = `${modelName}.${section.fields[index].field}`;
                            //sprawdzam czy istnieją preferencje:
                            const headers = await models["Table"].findOne({ account: this.getAccount(), user: this.getUser(), table: `${modelName}.${section.fields[index].field}` }).exec()
                           //console.log(headers,{ account: this.getAccount(), user: this.getUser(), table: `${modelName}.${section.fields[index].field}` })
                            if (headers) {
                                section.fields[index].preference = headers._id;
                                section.fields[index].selected = headers.selected.filter(field => section.fields[index].fields.find((f: any) => f.field == field))

                            }
                        }
                    }
                }

            }
        }
        return form;
    } else return null;
    // return {
    //     tabs: [
    //         {
    //             value: 'main',
    //             name: i18n.__(`${modelName.toLowerCase()}.main`),
    //             editable: true,
    //             sections: [
    //                 {
    //                     value: 'general',
    //                     name: i18n.__(`${modelName.toLowerCase()}.general`),
    //                     editable: true,
    //                     fields: [
    //                         "name", "firstName", "lastName", "entityType", "email", "email2", "phone", "phone2", "website", "category", "group", "salesRep", "lastActivity", "memo"
    //                     ]
    //                 },
    //                 {
    //                     value: 'contacts',
    //                     name: i18n.__(`${modelName.toLowerCase()}.contacts`),
    //                     editable: true,
    //                     fields: [
    //                         "contacts"
    //                     ]
    //                 }
    //             ]
    //         }, {
    //             value: 'addresses',
    //             name: i18n.__(`${modelName.toLowerCase()}.addresses`),
    //             editable: true,
    //             sections: [
    //                 {
    //                     value: 'billingAddress',
    //                     //subdoc: 'billingAddress',
    //                     name: i18n.__(`${modelName.toLowerCase()}.billingAddress`),
    //                     editable: true,
    //                     fields: [
    //                         ["billingAddress"],
    //                     ],
    //                 },
    //                 {
    //                     value: 'shippingAddress',
    //                     //subdoc: 'shippingAddress',
    //                     name: i18n.__(`${modelName.toLowerCase()}.shippingAddress`),
    //                     editable: true,
    //                     fields: [
    //                         ["shippingAddress"],
    //                     ],
    //                 },
    //                 {
    //                     value: 'addressbook',
    //                     name: i18n.__(`${modelName.toLowerCase()}.addressbook`),
    //                     editable: true,
    //                     fields: [
    //                         "addresses"
    //                     ]
    //                 }
    //             ]
    //         }, {
    //             value: 'sales',
    //             name: i18n.__(`${modelName.toLowerCase()}.sales`),
    //             editable: false,
    //             sections: [
    //                 {
    //                     value: 'openOrders',
    //                     name: i18n.__(`${modelName.toLowerCase()}.openorders`),
    //                     editable: false,
    //                     component: "OpenOrders"
    //                 },
    //                 {
    //                     value: 'relatedTransactions',
    //                     name: i18n.__(`${modelName.toLowerCase()}.relatedtransactions`),
    //                     editable: false,
    //                     component: "RelatedTransactions"
    //                 },
    //                 // {
    //                 //     value: 'priceLevels',
    //                 //     name: i18n.__(`${this.modelName.toLowerCase()}.pricelevels`),
    //                 //     fields: [
    //                 //         "priceLevels"
    //                 //     ]
    //                 // }
    //             ]
    //         }, {
    //             value: 'financial',
    //             name: i18n.__(`${modelName.toLowerCase()}.financial`),
    //             editable: true,
    //             sections: [
    //                 {
    //                     value: 'accounting',
    //                     name: i18n.__(`${modelName.toLowerCase()}.accounting`),
    //                     editable: true,
    //                     fields: [
    //                         "accountOnHold", "taxRate", "taxNumber", "currency", "terms", "paymentMethod", "creditLimit", "firstSalesDate", "lastSalesDate", "firstOrderDate", "lastOrderDate"
    //                     ]
    //                 },
    //                 {
    //                     value: 'statement',
    //                     name: i18n.__(`${modelName.toLowerCase()}.statement`),
    //                     editable: false,
    //                     component: 'statement'
    //                 }
    //             ]
    //         }, {
    //             value: 'analysis',
    //             name: i18n.__(`${modelName.toLowerCase()}.analysis`),
    //             editable: false,
    //             sections: [
    //                 {
    //                     value: 'statistics',
    //                     name: i18n.__(`${modelName.toLowerCase()}.statistics`),
    //                     editable: false,
    //                     component: 'CustomerStatistics'
    //                 },
    //                 {
    //                     value: 'topitems',
    //                     name: i18n.__(`${modelName.toLowerCase()}.topitems`),
    //                     editable: false,
    //                     component: 'CustomerTopItems'
    //                 }
    //             ]
    //         }, {
    //             value: 'communication',
    //             name: i18n.__(`${modelName.toLowerCase()}.communication`),
    //             editable: false,
    //             sections: [
    //                 {
    //                     value: 'notes',
    //                     name: i18n.__(`${modelName.toLowerCase()}.notes`),
    //                     editable: false,
    //                     component: 'Notes'
    //                 },
    //                 {
    //                     value: 'emails',
    //                     name: i18n.__(`${modelName.toLowerCase()}.emails`),
    //                     editable: false,
    //                     component: 'Emails'
    //                 }
    //             ]
    //         }, {
    //             value: 'systeminformation',
    //             name: i18n.__(`${modelName.toLowerCase()}.systeminformation`),
    //             editable: false,
    //             sections: [
    //                 {
    //                     value: 'changelogs',
    //                     name: i18n.__(`${modelName.toLowerCase()}.changelogs`),
    //                     editable: false,
    //                     component: 'ChangeLogs'
    //                 },

    //             ]
    //         }
    //     ]
    // }
}