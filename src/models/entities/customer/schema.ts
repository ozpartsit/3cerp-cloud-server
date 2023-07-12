import { Schema, model } from "mongoose";
import { IEntity } from "../schema";
//import SalesOrder from "../../activities/calendar/schema";
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
}

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICustomer>(
  {
    status: {
      type: String,
      input: "select",
      resource: 'constants',
      constant: 'customerstatus'
    },
    //statistics
    firstSalesDate: { type: Date },
    lastSalesDate: { type: Date },
    firstOrderDate: { type: Date },
    lastOrderDate: { type: Date },
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
  },
  options
);

// schema.virtual("salesOrders", {
//   ref: "Calendar",
//   localField: "name",
//   foreignField: "name",
//   justOne: false,
//   autopopulate: true,
//   model: SalesOrder
// });

export default schema;
