import { Schema, model } from "mongoose";
import { IEntity } from "../schema";
//import SalesOrder from "../../activities/calendar/schema";
export interface ICustomer extends IEntity {
  // billingAddress: IAddress;
  // shippingAddress: IAddress;

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

// schema.virtual("salesOrders", {
//   ref: "Calendar",
//   localField: "name",
//   foreignField: "name",
//   justOne: false,
//   autopopulate: true,
//   model: SalesOrder
// });

export default schema;
