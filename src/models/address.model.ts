import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

import axios from "axios";
import Entity from "./entities/schema";
export interface IAddress extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  entity?: Schema.Types.ObjectId;
  name?: string;
  addressee?: string;
  address: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
  geoCodeHint?: string;
  latitude?: string;
  longitude?: string;

  billingAddress?: boolean;
  shippingAddress?: boolean;

  geoCode(geoCodeHint: string): any;
}
const options = {
  collection: "entities.addresses",
  type: "address"
};

interface IAddressModel extends Model<IAddress>, IExtendedModel<IAddress> { }

//schema to shere
export const nestedSchema = {
  name: { type: String, required: true, input: "TextField" },
  addressee: { type: String, input: "TextField" },
  address: { type: String, required: true, input: "TextField" },
  address2: { type: String, input: "TextField" },
  city: { type: String, required: true, input: "TextField" },
  zip: { type: String, required: true, input: "TextField" },
  country: {
    type: String,
    required: true,
    constant: "countries"
  },
  phone: { type: String, required: true, input: "TextField" },
  latitude: { type: String, input: "TextField", readonly: true },
  longitude: { type: String, input: "TextField", readonly: true }
}

export const schema = new Schema<IAddress>(
  {
    ...nestedSchema,
    entity: { type: Schema.Types.ObjectId, input: "SelectField" },
    billingAddress: { type: Boolean, default: false, input: "SwitchField" },
    shippingAddress: { type: Boolean, default: false, input: "SwitchField" },
    geoCodeHint: {
      type: String,
      input: "TextField"
    },

  },
  options
);
schema.method("geoCode", async function (geoCodeHint: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(geoCodeHint)}&key=${process.env.GOOGLE_API_KEY}`
    );
    return {
      latitude: response.data.results[0].geometry.location.lat,
      longitude: response.data.results[0].geometry.location.lng
    };
  } catch (err) {
    return {};
  }
});
schema.pre("save", async function (next) {
  if (!this.geoCodeHint || this.isModified("zip") || this.isModified("city") || this.isModified("country"))
    this.geoCodeHint = `${this.zip} ${this.city} ${this.country}`;

  if (this.isModified("geoCodeHint") || !this.latitude || this.longitude) {
    const coordinate = await this.geoCode(this.geoCodeHint || "");
    this.latitude = coordinate.latitude;
    this.longitude = coordinate.longitude;
  } else
    return next();
  next();
});

// schema.post("save", async function (next) {
//   if (this.entity) {
//     console.log("update address")
//     const owner = await Entity.getDocument(this.entity.toString(), "advanced");

//     if (owner) {
//       await owner.recalcDocument();
//       // Object.keys(nestedSchema).forEach(async (field) => {
//       //   if (this.billingAddress)
//       //     await owner.setValue(field, this[field], "billingAddress", null, null, null);
//       //   if (this.shippingAddress)
//       //     await owner.setValue(field, this[field], "shippingAddress", null, null, null)
//       // })
//       // await owner.saveDocument();
//     }

//   }
// })

const Address: IAddressModel = model<IAddress, IAddressModel>("Address", schema);
export default Address;
