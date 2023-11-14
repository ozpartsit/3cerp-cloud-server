import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
export default function getForm<T extends IExtendedDocument>(this: Model<T>, local: string, parent: string) {

    return {
        sections: [
            {
                name: i18n.__(`${this.modelName.toLowerCase()}.main`),
                readonly: true,
                cols: [
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.billing`),
                        rows: [
                            ["name", "email", "website"],
                            ["phone", "category", "salesRep"],
                            ["billingAddress", "shippingAddress"]
                        ]
                    },
                    {
                        name: null,
                        component: "GoogleMap"
                    },
                ]
            },
            {
                name: i18n.__(`${this.modelName.toLowerCase()}.general`),
                cols: [],
                tabs: [
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.main`),
                        tabs: [
                            {
                                name: i18n.__(`${this.modelName.toLowerCase()}.main`),
                                cols: [
                                    {
                                        name: i18n.__(`${this.modelName.toLowerCase()}.billing`),
                                        rows: [
                                            ["name", "email", "website"],
                                            ["phone", "category", "salesRep"],
                                        ]
                                    },

                                ]
                            },
                            {
                                name: i18n.__(`${this.modelName.toLowerCase()}.contact`),
                                cols: []
                            },
                        ]
                    },
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.addressbook`),
                        tabs: [
                            {
                                name: i18n.__(`${this.modelName.toLowerCase()}.defaultaddress`),
                                cols: [
                                    {
                                        name: i18n.__(`${this.modelName.toLowerCase()}.billing`),
                                        rows: [
                                            ["billingAddress.name", "billingAddress.addressee"],
                                            ["billingAddress.address", "billingAddress.address2"],
                                            ["billingAddress.city", "billingAddress.zip", "billingAddress.country"],
                                        ]
                                    },
                                    {
                                        name: i18n.__(`${this.modelName.toLowerCase()}.shipping`),
                                        rows: [
                                            ["shippingAddress.name", "shippingAddress.addressee"],
                                            ["shippingAddress.address", "shippingAddress.address2"],
                                            ["shippingAddress.city", "shippingAddress.zip", "shippingAddress.country"],
                                        ]
                                    },
                                ]
                            },
                            {
                                name: i18n.__(`${this.modelName.toLowerCase()}.addressbook`),
                                cols: []
                            },
                        ]
                    }
                ],
            },

        ]
    }


}