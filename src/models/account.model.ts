import * as mongoose from "mongoose";
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
    storageRoot?: mongoose.Schema.Types.ObjectId;
    initStorage(): Promise<IFolder & { _id: any; }>
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IAccountModel extends mongoose.Model<IAccount>, IExtendedModel<IAccount> { }

const options = {
    discriminatorKey: "type", collection: "accounts", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IAccount>(
    {
        id: {
            type: String,
            required: true,
            input: "TextField"
        },
        storageRoot: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
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
                urlcomponent: encodeURI(this.id),
                root: true
            }).save();
        } else {
            return res;
        }
    })
};

schema.post('save', async function () {
    const root = await this.initStorage();
    if (root) {
        await this.$model().updateOne({ _id: this._id }, { $set: { storageRoot: root._id } })
    }

});

const Account: IAccountModel = mongoose.model<IAccount, IAccountModel>(
    "Account",
    schema
);


Account.init().then(function (Event) {
    console.log('Account Builded');
    // Account.findById('64f4cc1c9842bd71489d1fa0').then(res => {
    //     if (res) res.save()
    // })
})

export default Account;
