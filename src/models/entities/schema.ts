import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import Contact, { IContact } from "./contact.schema";
import Address, { IAddress } from "./address.schema";
import Balance, { IBalance } from "./balance.schema";
import GroupLevel, { IGroupLevel } from "./grouplevel.schema";
import Currencies from "../../constants/currencies";
//import Countries from "../../constants/countries";

const contactModel = model("Contact", Contact);
const balanceModel = model("Balance", Balance);
const addressModel = model("Address", Address);
const groupLevelModel = model("GroupLevel", GroupLevel);
export interface IEntity {
  _id: Schema.Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  type: string;
  email?: string;
  password?: string;
  locale?: string;
  salesRep: Schema.Types.ObjectId;
  warehouse: Schema.Types.ObjectId;
  currency?: string;
  taxNumber: string;
  tax: number;
  billingName?: string;
  billingAddressee?: string;
  billingAddress?: string;
  billingAddress2?: string;
  billingZip?: string;
  billingCity: string;
  billingState?: string;
  billingCountry: string;
  billingPhone?: string;
  billingEmail?: string;

  shippingName?: string;
  shippingAddressee?: string;
  shippingAddress?: string;
  shippingAddress2?: string;
  shippingZip?: string;
  shippingCity: string;
  shippingState?: string;
  shippingCountry: string;
  shippingPhone?: string;
  shippingEmail?: string;

  contacts?: IContact[];
  balances?: IBalance[];
  addresses?: IAddress[];
  groupLevels?: IGroupLevel[];



  validatePassword(password: string): boolean;
  hashPassword(): any;
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
const SALT_WORK_FACTOR = 10;

const options = {
  discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IEntity>(
  {
    email: { type: String, input: "text" },
    name: {
      type: String,
      required: true,
      min: [3, "Must be at least 3 characters long, got {VALUE}"],
      input: "text"
    },
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    type: {
      type: String,
      required: true,
      enum: ["company", "customer", "vendor", "employee"],
      default: "customer",
      input: "select"
    },
    password: { type: String, input: "password" },
    locale: { type: String, default: "en" },
    salesRep: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
      autopopulate: true,
      input: "select"
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      autopopulate: true,
      input: "select"
    },
    currency: {
      type: String,
      required: true,
      //get: (v: any) => Currencies.getName(v),
      //enum: Currencies,
      default: "PLN",
      input: "select",
      resource: 'constants',
      constant: 'currencies'
    },
    billingName: {
      type: String,
      input: "text"
    },
    billingAddressee: {
      type: String,
      input: "text"
    },
    billingAddress: Address,
    billingAddress2: {
      type: String,
      input: "text"
    },
    billingZip: {
      type: String,
      input: "text"
    },
    billingCity: {
      type: String,
      input: "text"
    },
    billingState: {
      type: String,
      input: "select"
    },
    billingCountry: {
      type: String,
      input: "select",
      resource: 'constants',
      constant: 'countries'
    },
    billingPhone: {
      type: String,
      input: "text"
    },
    billingEmail: {
      type: String,
      input: "text"
    },
    shippingName: {
      type: String,
      input: "text"
    },
    shippingAddressee: {
      type: String,
      input: "text"
    },
    shippingAddress: Address,
    shippingAddress2: {
      type: String,
      input: "text"
    },
    shippingZip: {
      type: String,
      input: "text"
    },
    shippingCity: {
      type: String,
      input: "text"
    },
    shippingState: {
      type: String,
      input: "select"
    },
    shippingCountry: {
      type: String,
      input: "select",
      resource: 'constants',
      constant: 'countries'
    },
    shippingPhone: {
      type: String,
      input: "text"
    },
    shippingEmail: {
      type: String,
      input: "text"
    },
    taxNumber: { type: String, input: "TextField" },
    tax: {
      type: Number,
      default: 0,
      input: "PercentField"
    }
  },
  options
);
schema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: addressModel
});
schema.virtual("contacts", {
  ref: "Contact",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: contactModel
});
schema.virtual("balances", {
  ref: "Balance",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: balanceModel
});
schema.virtual("groupLevels", {
  ref: "GroupLevel",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: groupLevelModel
});
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
schema.index({ name: 1 });

export default schema;
