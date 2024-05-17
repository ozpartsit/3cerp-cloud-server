import * as mongoose from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IClassification extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
}
interface IClassificationModel extends mongoose.Model<IClassification>, IExtendedModel<IClassification> { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const ClassificationSchema = {
    name: { type: String, input: "Input", validType: "text" },
    description: { type: String, input: "Input", validType: "text" },
    type: {
        type: String,
        required: true,
    },
}
const options = {
    discriminatorKey: "type",
    collection: "classifications",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IClassification>(ClassificationSchema, options);
const Classification: IClassificationModel = mongoose.model<IClassification, IClassificationModel>(
    "Classification",
    schema
);
Classification.init().then(function (Event) {
    console.log('Classification Builded');
    //Classification.updateMany({}, { $set: { account: new mongo.ObjectId('64f4cc1c9842bd71489d1fa0') } }).exec()
})
export default Classification;