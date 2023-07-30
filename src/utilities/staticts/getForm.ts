import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
import i18n from "../../config/i18n";
export default function getForm<T extends IExtendedDocument>(this: Model<T>, local: string, parent: string) {

    return {
        sections: [
            {
                name: i18n.__(`${this.modelName.toLowerCase()}.main`),
                cols: [
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.billing`),
                        rows: [
                            ["entity", "date"],
                            ["billingAddress"],
                            ["paymentMethod", "terms"]
                        ]
                    },
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.shipping`),
                        rows: [
                            ["shippingAddress"],
                            ["shippingMethod", "shippingCost"],
                            ["deliveryTerms"]
                        ]
                    },
                    {
                        name: null,
                        component: "GoogleMap"
                    },
                ]
            },
            {
                name: i18n.__(`${this.modelName.toLowerCase()}.items`),
                cols: [],
                table: "lines"
            },
            {
                name: i18n.__(`${this.modelName.toLowerCase()}.others`),
                cols: [
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.accounting`),
                        rows: [
                            ["company"],
                            ["currency"],
                            ["exchangeRate"],
                            ["tax"],
                            ["taxNumber"]
                        ]

                    },
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.classification`),
                        rows: [
                            ["referenceNumber"],
                            ["warehouse"]
                            ["salesRep"],
                            ["source"]
                        ]
                    },
                    {
                        name: i18n.__(`${this.modelName.toLowerCase()}.comments`),
                        rows: [
                            ["memo"]
                        ]
                    },
                ],
            },
        ]
    }


}