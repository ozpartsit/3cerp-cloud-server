import { Schema } from "mongoose";
import bcrypt from "bcrypt";

import Currencies from "../../constants/currencies";
import Countries from "../../constants/countries";
export interface IEntity {
  _id: Schema.Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  type: string;
  email?: string;
  password?: string;

  currency?: string;
  taxNumber: string;
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
schema.index({ name: 1 });

export default schema;
