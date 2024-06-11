import * as mongoose from "mongoose";
import Entity, { IEntity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Address, { IAddress, nestedSchema } from "../../address.model";
import form from "./form"
export interface ICustomer extends IEntity {
  firstName?: string;
  lastName?: string;
  status: string;
  //statistics
  firstSalesDate?: Date;
  lastSalesDate?: Date;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  lastActivity?: Date;
  //classsifictaions
  group?: mongoose.Schema.Types.ObjectId[];
  category?: mongoose.Schema.Types.ObjectId[];
  //accounting
  terms?: mongoose.Schema.Types.ObjectId;
  paymentMethod?: mongoose.Schema.Types.ObjectId;
  //entityType?: mongoose.Schema.Types.ObjectId;
  creditLimit?: Number;
  accountOnHold?: Boolean;
  salesRep?: mongoose.Schema.Types.ObjectId;

  billingAddress?: IAddress
  shippingAddress?: IAddress

  //information
  website?: String


}


export interface ICustomerModel extends mongoose.Model<ICustomer>, IExtendedModel<ICustomer> { }

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new mongoose.Schema<ICustomer>(
  {
    firstName: { type: String, input: "Input", validType: "text", min: 1, max: 256 },
    lastName: { type: String, input: "Input", validType: "text", min: 1, max: 256 },
    status: {
      type: String,
      input: "Select",
      validType:"select",
      resource: 'constants',
      constant: 'customerstatus'
    },

    //addresses
    shippingAddress: { type: nestedSchema, validType: "nestedDocument", virtualPath: "addresses" },
    billingAddress: { type: nestedSchema, validType: "nestedDocument", virtualPath: "addresses" },
    //statistics
    firstSalesDate: { type: Date, input: 'DatePicker', validType: "date", readonly: true },
    lastSalesDate: { type: Date, input: 'DatePicker', validType: "date", readonly: true },
    firstOrderDate: { type: Date, input: 'DatePicker', validType: "date", readonly: true },
    lastOrderDate: { type: Date, input: 'DatePicker', validType: "date", readonly: true },
    lastActivity: { type: Date, input: 'DatePicker', validType: "date" },
    //classsifictaions
    group: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      autopopulate: true,
      input: "Autocomplete"
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      autopopulate: true,
      input: "Select",
      validType:"select",
    },
    // entityType: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "EntityType",
    //   autopopulate: true,
    //   input: "Select",
    //   validType:"select",
    // },
    //accounting
    terms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "Select",
      validType:"select",
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      autopopulate: true,
      input: "Select",
      validType:"select",
    },
    creditLimit: {
      type: Number,
      input: "Input",
      validType: "currency",
      precision: 2
    },
    accountOnHold: {
      type: Boolean,
      input: "Switch",
      validType: "switch",
      default: false,
    },
    salesRep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
      input: "Select",
      validType:"url",
      hint: "Sales Representative",
      help: "A sales rep interacts directly with customers throughout all phases of the sales process."
    },

    //information
    website: {
      type: String,
      input: "Input",
      validType: "url",
    },

  },
  options
);


schema.static("form", () => form)

schema.method("recalc", async function () {

  console.log("recalc", "customer")
  if (this.$locals.triggers)
    for (let trigger of this.$locals.triggers) {
      this.$locals.triggers.shift();
      // if (trigger.subdoc == "billingAddress" && trigger.field == "_id") {
      //   await updateAddress(this, "billingAddress")
      // }
      // if (trigger.subdoc == "shippingAddress" && trigger.field == "_id") {
      //   await updateAddress(this, "shippingAddress")
      // }
      // if (trigger.subdoc == "billingAddress") {
      //   await updateDefaultAddress(this, "billingAddress")
      // }
      // if (trigger.subdoc == "shippingAddress") {
      //   await updateDefaultAddress(this, "shippingAddress")
      // }

    }

})

const Customer: ICustomerModel = Entity.discriminator<
  ICustomer,
  ICustomerModel
>("customer", schema);

// copy
Entity.discriminator<
  ICustomer,
  ICustomerModel
>("Customer", schema);

export default Customer;


// aktualizuje dokument powiązany jako domyślny
async function updateDefaultAddress(doc: ICustomer, type: string) {
  const address = (doc.addresses || []).find(address => address[type]);
  if (address) {
    for (let field of Object.keys(nestedSchema)) {
      await address.setValue(field, doc[type][field], null, null, null, null);
    }
  } else {
    let defaultAddress = { ...doc[type] };
    defaultAddress[type] = true;
    await doc.addToVirtuals("addresses", defaultAddress);
  }
}
async function updateAddress(doc: ICustomer, type: string) {
  const address = (doc.addresses || []).find(address => doc[type] && doc[type]._id && address._id.toString() == doc[type]._id.toString());
  //console.log(address)
  if (address) {
    for (let field of Object.keys(nestedSchema)) {
      await doc.setValue(field, address[field], type, null, null, null);
    }
  }
}