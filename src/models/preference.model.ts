import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


export interface IPreference extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    type: string;
    locale: string;
    timezoneOffset: number;
    themeDarkMode: boolean;
    theme: string;
    exportDecimalSeparator: string;
    exportCsvSeparator: string;
    tooltips: boolean;
    notifications: boolean;
}



// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IPreferenceModel extends mongoose.Model<IPreference>, IExtendedModel<IPreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IPreference>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        locale: { type: String, default: "en", input: "SelectField" },
        timezoneOffset: { type: Number, default: 0, input: "NumberField" },
        themeDarkMode: { type: Boolean, default: true, input: "SwitchField" },
        theme: { type: String, default: "default_light_theme", input: "SelectField" },
        exportDecimalSeparator: { type: String, default: "en", input: "SelectField" },
        exportCsvSeparator: { type: String, default: "en", input: "SelectField" },
        tooltips: { type: Boolean, default: true, input: "SwitchField" },
        notifications: { type: Boolean, default: true, input: "SwitchField" },
    },
    options
);



schema.index({ name: 1 });

const Preference: IPreferenceModel = mongoose.model<IPreference, IPreferenceModel>(
    "UserPreference",
    schema
);
export default Preference;
