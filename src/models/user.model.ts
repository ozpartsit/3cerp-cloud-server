import { Schema, model, Model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import Access, { IAccess } from "./access.model";

export interface IUser extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    account: Schema.Types.ObjectId;
    name: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    avatar: Schema.Types.ObjectId;
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

}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IUserModel extends Model<IUser>, IExtendedModel<IUser> { }

const options = {
    discriminatorKey: "type", collection: "users", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IUser>(
    {
        account: { type: Schema.Types.ObjectId, required: true },
        email: { type: String, input: "TextField" },
        name: {
            type: String,
            required: true,
            input: "TextField"
        },
        firstName: {
            type: String,
            input: "TextField"
        },
        lastName: {
            type: String,
            input: "TextField"
        },
        jobTitle: {
            type: String,
            input: "TextField"
        },
        avatar: {
            type: Schema.Types.ObjectId,
            ref: "Storage",
            autopopulate: true,
            input: "FileField"
        },
        department: {
            type: String,
            input: "TextField"
        },
        lastLoginDate: {
            type: Date
        },
        lastAuthDate: {
            type: Date
        },
        type: {
            type: String,
            required: true
        },
        locale: { type: String, default: "en", input: "SelectField" },
        role: { type: String, required: true, input: "TextField" },
        roles: { type: [String], input: "SelectField" },
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
    foreignField: "User",
    justOne: false,
    autopopulate: true,
    copyFields: ["account"],
    model: Access
});


schema.index({ name: 1 });

const User: IUserModel = model<IUser, IUserModel>(
    "User",
    schema
);
export default User;
