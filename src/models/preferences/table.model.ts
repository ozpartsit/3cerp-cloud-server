import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
export interface ISetting extends IExtendedDocument {
    entity: Schema.Types.ObjectId;
    type: string;
    table: string;
    headers: string[]
}
interface ISettingModel extends Model<ISetting>, IExtendedModel { }

export const schema = new Schema<ISetting>(
    {

        type: {
            type: String,
            required: true,
            default: "table"
        },
        table: {
            type: String,
            required: true,
        },
        entity: {
            type: Schema.Types.ObjectId,
            ref: "Entity"
        },
        headers: {
            type: [String]
        }
    },
    {
        collection: "settings",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


schema.index({ name: 1 });

const Setting: ISettingModel = model<ISetting, ISettingModel>("Setting", schema);
export default Setting;

