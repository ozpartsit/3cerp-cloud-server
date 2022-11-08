import { model } from "mongoose";

import EntitySchema from "./schema";
import CompanySchema from "./company/schema";
import CustomerSchema from "./customer/schema";
import VendorSchema from "./vendor/schema";
import EmployeeSchema from "./employee/schema";

const Entity = model("Entity", EntitySchema);
export default Entity;

export const EntityTypes: any = {
  customer: Entity.discriminator("Customer", CustomerSchema),
  comapany: Entity.discriminator("Company", CompanySchema),
  vendor: Entity.discriminator("Vendor", VendorSchema),
  employee: Entity.discriminator("Employee", EmployeeSchema)
};
