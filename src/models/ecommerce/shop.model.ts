import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import Address, { IAddress, nestedSchema } from "../address.model";
import Page, { IPage } from "./page.schema";

import form from "./form"

export interface IShop extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    type: string;
    status: string;

    //Main
    subdomain: string;
    domain: string;
    salesRep: mongoose.Schema.Types.ObjectId;
    email: mongoose.Schema.Types.ObjectId;
    phone?: string;

    //classsifictaions
    group?: mongoose.Schema.Types.ObjectId[];
    category?: mongoose.Schema.Types.ObjectId[];

    //META TAGS
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;

    //Google Tag
    GSC: string;

    //Social Media Tag
    ogTitle: string;
    ogUrl: string;
    ogDescription: string;
    ogImage: string;

    //Social Media Link
    twitterUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    linkedinUrl: string;

    // Settings
    currencies: string[]
    languages: string[]

    // Address
    address?: IAddress

    // Payment Method
    paymentMethods?: mongoose.Schema.Types.ObjectId[];
    // Delivery Methods
    deliveryMethods?: mongoose.Schema.Types.ObjectId[];


    // Domains

    //wygląd
    template: string;
    logo: mongoose.Schema.Types.ObjectId;
    colorPrimary: string
    colorSecondary: string
    colorAccent: string

    // CMS

    pages: IPage[];


}
export interface IShopModel extends mongoose.Model<IShop>, IExtendedModel<IShop> { }

export const schema = new mongoose.Schema<IShop>(
    {
        name: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        subdomain: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        type: {
            type: String,
            required: true,
            enum: ["webshop"],
            default: "webshop"
        },
        template: {
            type: String,
            required: true,
            default: "default",
            constant: 'template',
            input: "Select",
        },
        status: {
            type: String,
            required: true,
            enum: ["online", "offline"],
            default: "offline"
        },
        domain: {
            type: String,
            input: "Input",
            validType: "text",
        },
        salesRep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true,
            input: "Select",
            validType: "url",
            hint: "Sales Representative",
            help: "A sales rep interacts directly with customers throughout all phases of the sales process."
        },
        email: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Email",
            autopopulate: true,
            input: "Select",
            validType: "url"
        },
        phone: { type: String, input: "Input", validType: "phone", min: 6, max: 15 },


        //classsifictaions
        group: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Group",
            autopopulate: true,
            input: "Autocomplete"
        },
        category: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Category",
            autopopulate: true,
            input: "Select",
            validType: "select",
        },

        metaTitle: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "The <title> element typically appears as a clickable headline in search engine results"
        },
        metaDescription: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "Meta description also resides in the <head> of a webpage and is commonly (though not always) displayed in a SERP snippet along with a title and page URL."
        },
        metaKeywords: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },

        GSC: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            hint: "Google Search Console",
            help: "Google Search Console ID Tag"
        },


        ogTitle: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "Here, you put the title to which you want to be displayed when your page is linked."
        },
        ogDescription: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "Your page’s description. Remember that Facebook will display only about 300 characters of description."
        },
        ogUrl: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "Your page’s URL."
        },
        ogImage: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
            help: "Here, you can put the URL of an image you want shown when your page is linked to"
        },



        facebookUrl: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        twitterUrl: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        instagramUrl: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },
        linkedinUrl: {
            type: String,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "Input",
            validType: "text",
        },


        currencies: {
            type: [String],
            default: ["PLN"],
            input: "Select",
            constant: 'currency',
            defaultSelect: true
        },
        languages: {
            type: [String],
            default: ["EN"],
            input: "Select",
            constant: 'language',
            defaultSelect: true
        },

        address: { type: nestedSchema, validType: "nestedDocument", virtualPath: "addresses" },

        paymentMethods: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "PaymentMethod",
            autopopulate: true,
            input: "Select",
            validType: "select",
        },
        deliveryMethods: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "PaymentMethod",
            autopopulate: true,
            input: "Select",
            validType: "select",
        },


        colorPrimary: { type: String, input: "ColorPicker", validType: "colorPicker" },
        colorSecondary: { type: String, input: "ColorPicker", validType: "colorPicker" },
        colorAccent: { type: String, input: "ColorPicker", validType: "colorPicker" },
        logo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Storage",
            autopopulate: true,
            input: "File",
            validType: "images"
        },

    },

    {
        collection: "websites",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
schema.virtual('url').get(function (this: any) {
    return `https://${this.subdomain}.3cerp.cloud`;
});

schema.static("form", () => form)
// schema.virtual("paymentMethods", {
//     ref: "Contact",
//     localField: "_id",
//     foreignField: "entity",
//     justOne: false,
//     autopopulate: true,
//     sortable: true,
//     editable: true,
//     removable: true,
//     addable: true,
//     groupable: true,
//     model: Contact
//   });

schema.virtual("pages", {
    ref: "Page",
    localField: "_id",
    foreignField: "webshop",
    justOne: false,
    autopopulate: true,
    //defaultSelect: true,
    copyFields: ["account"],
    //options: { sort: { category: 1 } },
});

schema.index({ name: 1 });

const Shop: IShopModel = mongoose.model<IShop, IShopModel>("webshop", schema);

Shop.init().then(function (Event) {
    console.log('Web Shop Builded');
    new Page()
})
export default Shop;

