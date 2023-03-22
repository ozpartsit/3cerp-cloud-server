import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";

// Iterfaces ////////////////////////////////////////////////////////////////////////////////
export interface IActivity extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    name: string;
    type: string;
    description?: string;

    status: string;

}
interface IActivityModel extends Model<IActivity>, IExtendedModel { }

// Schemas ////////////////////////////////////////////////////////////////////////////////

const options = {
    discriminatorKey: "type",
    collection: "activities",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IActivity>(
    {
        name: { type: String, required: true, input: "text" },
        description: { type: String, input: "text", default: "" },
        type: {
            type: String,
            required: true,
            input: "select"
        },
        status: {
            type: String,
        },

    },
    options
);

const Activity: IActivityModel = model<IActivity, IActivityModel>("Activity", schema);
export default Activity;
