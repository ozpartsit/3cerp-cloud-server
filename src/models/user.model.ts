import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import Access, { IAccess } from "./access.model";
import Preference, { IPreference } from "./preference.model";
import Note from "./note.model";
export interface IUser extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    name: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    avatar: mongoose.Schema.Types.ObjectId;
    department: string;
    initials: string;
    lastLoginDate: Date;
    lastAuthDate: Date;
    type: string;
    email?: string;
    locale?: string;
    role: string,
    roles: string[],
    accesses?: IAccess[];
    preference: IPreference;
    initPreference(): Promise<IPreference & { _id: any; }>
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IUserModel extends mongoose.Model<IUser>, IExtendedModel<IUser> { }

const options = {
    discriminatorKey: "type", collection: "users", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IUser>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        email: { type: String, input: "Input", validType: "email" },
        name: {
            type: String,
            required: true,
            input: "Input", validType: "text"
        },
        firstName: {
            type: String,
            input: "Input", validType: "text"
        },
        lastName: {
            type: String,
            input: "Input", validType: "text"
        },
        jobTitle: {
            type: String,
            input: "Input", validType: "text"
        },
        avatar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Storage",
            autopopulate: true,
            input: "Salect",
            validType: "file"
        },
        department: {
            type: String,
            input: "Input", validType: "text"
        },
        lastLoginDate: {
            type: Date,
            input: "DatePicker", validType: "date"
        },
        lastAuthDate: {
            type: Date,
            input: "DatePicker", validType: "date"
        },
        type: {
            type: String,
            required: true
        },
        locale: { type: String, default: "en" },
        role: { type: String, required: true },
        roles: { type: [String] },
    },
    options
);
schema.virtual('initials').get(function (this: IUser) {
    if (this.firstName && this.lastName)
        return `${this.firstName[0]}${this.lastName[0]}`;
    else return "";
});
schema.virtual("accessess", {
    ref: "Access",
    localField: "_id",
    foreignField: "user",
    justOne: true,
    autopopulate: true,
    copyFields: ["account"],
    model: Access
});
schema.virtual("preference", {
    ref: "Preference",
    localField: "_id",
    foreignField: "user",
    justOne: true,
    autopopulate: true,
    copyFields: ["account", "user"],
    model: Preference
});
schema.virtual("notebook", {
    ref: "Note",
    localField: "_id",
    foreignField: "user",
    justOne: false,
    autopopulate: true,
    //defaultSelect: true,
    copyFields: ["account", "user"],
    options: { sort: { index: 1 } },
});
schema.virtual("favorites", {
    ref: "Favorites",
    localField: "_id",
    foreignField: "user",
    justOne: false,
    autopopulate: true,
    //defaultSelect: true,
    copyFields: ["account", "user"],
    options: { sort: { category: 1 } },
});


schema.methods.initPreference = async function () {
    //let PreferenceModel = Preference.setAccount(this.account.toString(), this._id.toString());
    return await Preference.findById(this._id).then(async (res) => {
        //jeżeli folder w DB nie istnieje - dodaj
        if (!res) {
            return await new Preference({
                _id: this._id,
                user: this._id,
                type: "Preference",
                account: this.account
            }).save();
        } else {
            return res;
        }
    })
};

schema.post('save', function () {
    this.initPreference();

});

schema.index({ name: 1 });

const User: IUserModel = mongoose.model<IUser, IUserModel>(
    "User",
    schema
);
export default User;
