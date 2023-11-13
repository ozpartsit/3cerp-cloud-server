import { Schema, Model } from "mongoose";
import Entity, { IEntity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import { IAddress, nestedSchema } from "../../address.model";
export interface ICustomer extends IEntity {
  status: string;
  //statistics
  firstSalesDate?: Date;
  lastSalesDate?: Date;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  //classsifictaions
  group?: Schema.Types.ObjectId;
  category?: Schema.Types.ObjectId;
  //accounting
  terms?: Schema.Types.ObjectId;
  paymentMethod?: Schema.Types.ObjectId;

  salesRep?: Schema.Types.ObjectId;

  billingAddress?: IAddress
  shippingAddress?: IAddress

  //
  website: {
    type: String,
    input: "TextField"
  },
}


export interface ICustomerModel extends Model<ICustomer>, IExtendedModel<ICustomer> { }

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICustomer>(
  {
    status: {
      type: String,
      input: "select",
      resource: 'constants',
      constant: 'customerstatus'
    },
    //addresses
    shippingAddress: nestedSchema,
    billingAddress: nestedSchema,
    //statistics
    firstSalesDate: { type: Date, input: 'DateType', readonly: true },
    lastSalesDate: { type: Date, input: 'DateType', readonly: true },
    firstOrderDate: { type: Date, input: 'DateType', readonly: true },
    lastOrderDate: { type: Date, input: 'DateType', readonly: true },
    //classsifictaions
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      autopopulate: true,
      input: "SelectField"
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      autopopulate: true,
      input: "SelectField"
    },
    //accounting
    terms: {
      type: Schema.Types.ObjectId,
      ref: "Terms",
      autopopulate: true,
      input: "SelectField"
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      autopopulate: true,
      input: "SelectField"
    },
    salesRep: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
      input: "SelectField",
      hint: "Sales Representative",
      help:" A sales rep interacts directly with customers throughout all phases of the sales process."
    },
  },
  options
);


const Customer: ICustomerModel = Entity.discriminator<
  ICustomer,
  ICustomerModel
>("Customer", schema);
export default Customer;