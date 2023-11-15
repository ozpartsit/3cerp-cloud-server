import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
export default function getForm<T extends IExtendedDocument>(this: Model<T>, local: string, parent: string) {

    return {
        tabs: [
            {
                value: 'main',
                name: i18n.__(`${this.modelName.toLowerCase()}.main`),
                editable: true,
                sections: [
                    {
                        value: 'general',
                        name: i18n.__(`${this.modelName.toLowerCase()}.general`),
                        fields: [
                            "name", "firstName", "lastName", "entityType", "email", "email2", "phone", "phone2", "website", "category", "group", "salesRep", "memo"
                        ]
                    },
                    {
                        value: 'contacts',
                        name: i18n.__(`${this.modelName.toLowerCase()}.contacts`),
                        fields: [
                            "contacts"
                        ]
                    }
                ]
            }, {
                value: 'addresses',
                name: i18n.__(`${this.modelName.toLowerCase()}.addresses`),
                editable: true,
                sections: [
                    {
                        value: 'billingAddress',
                        //subdoc: 'billingAddress',
                        name: i18n.__(`${this.modelName.toLowerCase()}.billingAddress`),
                        fields: [
                            ["billingAddress"],
                        ],
                    },
                    {
                        value: 'shippingAddress',
                        //subdoc: 'shippingAddress',
                        name: i18n.__(`${this.modelName.toLowerCase()}.shippingAddress`),
                        fields: [
                            ["shippingAddress"],
                        ],
                    },
                    {
                        value: 'addressbook',
                        name: i18n.__(`${this.modelName.toLowerCase()}.addressbook`),
                        fields: [
                            "addresses"
                        ]
                    }
                ]
            }, {
                value: 'sales',
                name: i18n.__(`${this.modelName.toLowerCase()}.sales`),
                editable: false,
                sections: [
                    {
                        value: 'openOrders',
                        name: i18n.__(`${this.modelName.toLowerCase()}.openorders`),
                        component: "OpenOrders"
                    },
                    {
                        value: 'relatedTransactions',
                        name: i18n.__(`${this.modelName.toLowerCase()}.relatedtransactions`),
                        component: "RelatedTransactions"
                    },
                    // {
                    //     value: 'priceLevels',
                    //     name: i18n.__(`${this.modelName.toLowerCase()}.pricelevels`),
                    //     fields: [
                    //         "priceLevels"
                    //     ]
                    // }
                ]
            }, {
                value: 'financial',
                name: i18n.__(`${this.modelName.toLowerCase()}.financial`),
                editable: true,
                sections: [
                    {
                        value: 'accounting',
                        name: i18n.__(`${this.modelName.toLowerCase()}.accounting`),
                        fields: [
                            "tax", "taxNumber", "currency", "terms", "paymentMethod", "firstSalesDate", "lastSalesDate", "firstOrderDate", "lastOrderDate"
                        ]
                    },
                    {
                        value: 'statement',
                        name: i18n.__(`${this.modelName.toLowerCase()}.statement`),
                        editable: true,
                        component: 'statement'
                    }
                ]
            }, {
                value: 'analysis',
                name: i18n.__(`${this.modelName.toLowerCase()}.analysis`),
                editable: false,
                sections: [
                    {
                        value: 'statistics',
                        name: i18n.__(`${this.modelName.toLowerCase()}.statistics`),
                        component: 'CustomerStatistics'
                    },
                    {
                        value: 'topitems',
                        name: i18n.__(`${this.modelName.toLowerCase()}.topitems`),
                        component: 'CustomerTopItems'
                    }
                ]
            }, {
                value: 'communication',
                name: i18n.__(`${this.modelName.toLowerCase()}.communication`),
                editable: false,
                sections: [
                    {
                        value: 'notes',
                        name: i18n.__(`${this.modelName.toLowerCase()}.notes`),
                        component: 'Notes'
                    },
                    {
                        value: 'emails',
                        name: i18n.__(`${this.modelName.toLowerCase()}.emails`),
                        component: 'Emails'
                    }
                ]
            }, {
                value: 'systeminformation',
                name: i18n.__(`${this.modelName.toLowerCase()}.systeminformation`),
                editable: false,
                sections: [
                    {
                        value: 'changelogs',
                        name: i18n.__(`${this.modelName.toLowerCase()}.changelogs`),
                        component: 'ChangeLogs'
                    },

                ]
            }
        ]
    }
}