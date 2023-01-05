import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

export interface IClassification extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    type: string;
    name: string;

}
interface IClassificationModel extends Model<IClassification>, IExtendedModel { }
// Schemas ////////////////////////////////////////////////////////////////////////////////

const ClassificationSchema = {
    name: { type: String, },
}
const options = {
    discriminatorKey: "type",
    collection: "classifications",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IClassification>(ClassificationSchema, options);
const Classification: IClassificationModel = model<IClassification, IClassificationModel>(
    "Classification",
    schema
);
export default Classification;