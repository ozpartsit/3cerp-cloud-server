import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import bcrypt from "bcryptjs";
export interface IAccess extends IExtendedDocument {

    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    password: string;
    email: string;
    active: boolean;
    temporary: boolean;
    validatePassword(password: string): boolean;
    hashPassword(): any;
}
const SALT_WORK_FACTOR = 10;

const options = {
    collection: "accesses",
    type: "access"
};

interface IAccessModel extends Model<IAccess>, IExtendedModel<IAccess> { }

const schema = new Schema<IAccess>(
    {
        user: { type: Schema.Types.ObjectId, required: true },
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

schema.method("validatePassword", async function (newPassword: string) {
    return await bcrypt.compare(newPassword, this.password);
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    else this.password = await this.hashPassword();
    next();
});

const Access: IAccessModel = model<IAccess, IAccessModel>("Access", schema);
export default Access;
