import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IPage extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
}
interface IPageModel extends mongoose.Model<IPage>, IExtendedModel<IPage> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const PageSchema = {
    name: { type: String, input: "Input", validType: "text" },
    description: { type: String, input: "Input", validType: "text" },
    type: {
        type: String,
        required: true,
    },
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