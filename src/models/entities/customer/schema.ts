import { Schema, model } from "mongoose";
import { IEntity } from "../schema";
import Contact, { IContact } from "./contact.schema";
import Address, { IAddress } from "./address.schema";
import Balance, { IBalance } from "./balance.schema";
const contactModel = model("Contact", Contact);
const balanceModel = model("Balance", Balance);
const addressModel = model("Address", Address);
export interface ICustomer extends IEntity {
  // billingAddress: IAddress;
  // shippingAddress: IAddress;
  contacts?: IContact[];
  balances?: IBalance[];
}

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICustomer>(
  {
    // billingAddress: {
    //   type: Address,
    //   get: (v: any) =>
    //     `${v.addressee}\n${v.address}, ${v.address2}\n${v.zip} ${v.city}\n${v.country}`
    // },
    // shippingAddress: {
    //   type: Address,
    //   get: (v: any) =>
    //     `${v.addressee}\n${v.address}, ${v.address2}\n${v.zip} ${v.city}\n${v.country}`
    // }
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
export default schema;
