import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import Contact, { IContact } from "./contact.schema";
import Address, { IAddress } from "./address.schema";
import Balance, { IBalance } from "./balance.schema";
import GroupLevel, { IGroupLevel } from "./grouplevel.schema";
import Currencies from "../../constants/currencies";
import Countries from "../../constants/countries";

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

  salesRep: Schema.Types.ObjectId;
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

  status: string;

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

    salesRep: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
      autopopulate: true,
    },
    currency: {
      type: String,
      required: true,
      //get: (v: any) => Currencies.getName(v),
      enum: Currencies,
      default: "PLN",
    },
    billingName: {
      type: String
    },
    billingAddressee: {
      type: String
    },
    billingAddress: {
      type: String
    },
    billingAddress2: {
      type: String
    },
    billingZip: {
      type: String
    },
    billingCity: {
      type: String
    },
    billingState: {
      type: String,
    },
    billingCountry: {
      type: String,
      enum: Countries,
    },
    billingPhone: {
      type: String
    },
    billingEmail: {
      type: String
    },
    shippingName: {
      type: String
    },
    shippingAddressee: {
      type: String
    },
    shippingAddress: {
      type: String
    },
    shippingAddress2: {
      type: String
    },
    shippingZip: {
      type: String
    },
    shippingCity: {
      type: String
    },
    shippingState: {
      type: String,
    },
    shippingCountry: {
      type: String,
      enum: Countries,
    },
    shippingPhone: {
      type: String
    },
    shippingEmail: {
      type: String
    },
    taxNumber: { type: String },
    tax: {
      type: Number,
      default: 0,
    },
    status: {
      type: String
    },
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
