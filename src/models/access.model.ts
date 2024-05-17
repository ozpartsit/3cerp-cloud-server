import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import Email from "../services/email";
import jwt from "jsonwebtoken";
export interface IAccess extends IExtendedDocument {

    _id: mongoose.Schema.Types.ObjectId;
    user: IUser["_id"];
    account: mongoose.Schema.Types.ObjectId;
    password: string;
    email: string;
    active: boolean;
    temporary: boolean;
    validatePassword(password: string): boolean;
    hashPassword(): any;
    resetPassword(locale?: string): any;
    setPassword(locale?: string): any;
}

const SALT_WORK_FACTOR = 10;

const options = {
    collection: "accesses",
    type: "access"
};

interface IAccessModel extends mongoose.Model<IAccess>, IExtendedModel<IAccess> { }

const schema = new mongoose.Schema<IAccess>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        password: { type: String, input: "PasswordField", required: true },
        email: { type: String, input: "TextField", required: true },
        active: { type: Boolean, input: "SwitchField" },
        temporary: { type: Boolean, input: "SwitchField" },
    },
    options
);

// Methods
schema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    return await bcrypt.hash(this.password, salt);
};

schema.methods.resetPassword = async function (locale: string) {
    const tokenSecret: string = process.env.TOKEN_SECRET || "";
    const resetToken = jwt.sign({ _id: this._id }, tokenSecret, {
        expiresIn: "1h"
    });
    if (!locale) {
        await this.populate('user', 'locale');
        const user = this.user as unknown as IUser;
        locale = user.locale || "en";
    }
    let template = await Email.resetPassword(this.email, resetToken, locale);
    await Email.send(template);
};

schema.methods.setPassword = async function (locale: string) {
    const tokenSecret: string = process.env.TOKEN_SECRET || "";
    const resetToken = jwt.sign({ _id: this._id }, tokenSecret, {
        expiresIn: "1h"
    });
    if (!locale) {
        await this.populate('user', 'locale');
        const user = this.user as unknown as IUser;
        locale = user.locale || "en";
    }
    let template = await Email.newUser(this.email, resetToken, locale);
    await Email.send(template);
};

schema.method("validatePassword", async function (newPassword: string) {
    return await bcrypt.compare(newPassword, this.password);
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    else this.password = await this.hashPassword();

    //send email to gain access
    this.setPassword()
    next();
});

const Access: IAccessModel = mongoose.model<IAccess, IAccessModel>("Access", schema);
export default Access;
