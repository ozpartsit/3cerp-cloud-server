import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IPage extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    webshop: mongoose.Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;

    //META TAGS
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;

    html: string;
    pageType: string;
    urlComponent: string;
    // wygląd
    template: string;
    languages: string[]
    image: mongoose.Schema.Types.ObjectId;
}
interface IPageModel extends mongoose.Model<IPage>, IExtendedModel<IPage> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const PageSchema = {
    name: { type: String, input: "Input", validType: "text" },
    description: { type: String, input: "Input", validType: "text" },
    webshop: { type: mongoose.Schema.Types.ObjectId },
    metaTitle: {
        type: String,
        // min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "Input",
        validType: "text",
        help: "The <title> element typically appears as a clickable headline in search engine results"
    },
    metaDescription: {
        type: String,
        //  min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "Input",
        validType: "text",
        help: "Meta description also resides in the <head> of a webpage and is commonly (though not always) displayed in a SERP snippet along with a title and page URL."
    },
    metaKeywords: {
        type: String,
        //  min: [3, "Must be at least 3 characters long, got {VALUE}"],
        input: "Input",
        validType: "text",
    },
    urlComponent: { type: String, input: "Input", validType: "text" },
    html: { type: String, input: "RichText", validType: "richText" },
    template: {
        type: String,
        required: true,
        default: "page.ejs",
        input: "Input",
        validType: "text"
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Storage",
        autopopulate: true,
        input: "File",
        validType: "images"
    },
    languages: {
        type: [String],
        default: ["en"],
        input: "Select",
        constant: 'language',
        defaultSelect: true,

    },
    pageType: {
        type: String,
        required: true,
        input: "Input",
        validType: "text",
        default: 'page'
    },
    type: {
        type: String,
        required: true,
    }
}
const options = {
    discriminatorKey: "type",
    collection: "websites.pages",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IPage>(PageSchema, options);
const Page: IPageModel = mongoose.model<IPage, IPageModel>(
    "Page",
    schema
);
Page.init().then(function (Event) {
    console.log('Page Builded');
    //Page.updateMany({}, { $set: { account: new mongo.ObjectId('64f4cc1c9842bd71489d1fa0') } }).exec()
})
export default Page;