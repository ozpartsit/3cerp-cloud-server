import { Schema, model, Model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import Access, { IAccess } from "./access.model";
import User, { IUser } from "./user.model";
import Folder, { IFolder } from "./storages/folder/schema";

export interface IAccount extends IExtendedDocument {
    id: string;
    name: string;
    type: string;
    email?: string;
    locale?: string;
    dbName: string;
    dbPass: string;
    dbHost: string;
    initStorage(): Promise<IFolder & { _id: any; }>
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IAccountModel extends Model<IAccount>, IExtendedModel<IAccount> { }

const options = {
    discriminatorKey: "type", collection: "accounts", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IAccount>(
    {
        id: {
            type: String,
            required: true,
            input: "TextField"
        },
        email: { type: String, input: "TextField" },
        name: {
            type: String,
            required: true,
            input: "TextField"
        },
        type: {
            type: String,
            required: true,
            default: "Account"
        },
        locale: { type: String, default: "en", input: "SelectField" },
        dbName: { type: String },
        dbPass: { type: String },
        dbHost: { type: String },
    },
    options
);

schema.virtual("accessess", {
    ref: "Access",
    localField: "_id",
    foreignField: "account",
    justOne: false,
    autopopulate: true,
    model: Access
});
schema.virtual("users", {
    ref: "User",
    localField: "_id",
    foreignField: "account",
    justOne: false,
    autopopulate: true,
    copyFields: ["account"],
    model: User
});

schema.index({ name: 1 });

schema.methods.initStorage = async function () {

    //let FolderModel = Folder.setAccount(this._id);
    return await Folder.findOne({ path: encodeURI(this.id) }).then(async (res) => {
        //jeżeli folder w DB nie istnieje - dodaj
        if (!res) {
            return await new Folder({
                account: this._id,
                name: this.id,
                type: "Folder",
                path: encodeURI(this.id),
                urlcomponent: encodeURI(this.id)
            }).save();
        } else {
            return res;
        }
    })
};

schema.post('save', function () {
    this.initStorage();
});

const Account: IAccountModel = model<IAccount, IAccountModel>(
    "Account",
    schema
);
export default Account;
