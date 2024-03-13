import { Schema, model, Model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


export interface IPreference extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    account: Schema.Types.ObjectId;
    type: string;
    locale: string;
    timezoneOffset: number;
    themeDarkMode: boolean;
    exportDecimalSeparator: string;
    exportCsvSeparator: string;
    tooltips: boolean;
    notifications: boolean;
}



// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IPreferenceModel extends Model<IPreference>, IExtendedModel<IPreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IPreference>(
    {
        account: { type: Schema.Types.ObjectId, required: true },
        user: { type: Schema.Types.ObjectId, required: true },
        locale: { type: String, default: "en", input: "SelectField" },
        timezoneOffset: { type: Number, default: 0, input: "NumberField" },
        themeDarkMode: { type: Boolean, default: true, input: "SwitchField" },
        exportDecimalSeparator: { type: String, default: "en", input: "SelectField" },
        exportCsvSeparator: { type: String, default: "en", input: "SelectField" },
        tooltips: { type: Boolean, default: true, input: "SwitchField" },
        notifications: { type: Boolean, default: true, input: "SwitchField" },
    },
    options
);



schema.index({ name: 1 });

const Preference: IPreferenceModel = model<IPreference, IPreferenceModel>(
    "UserPreference",
    schema
);
export default Preference;
