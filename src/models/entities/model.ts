import Entity from "./schema";
import Customer, { ICustomerModel } from "./customer/schema";

export default Entity;


interface Types {
  customer: ICustomerModel;
}

export const EntityTypes: Types = {
  customer: Customer
};