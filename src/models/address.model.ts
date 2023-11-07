import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";

import axios from "axios";
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
  geoCode(geoCodeHint: string): any;
}
const options = {
  collection: "entities.addresses",
  type: "address"
};

interface IAddressModel extends Model<IAddress>, IExtendedModel<IAddress> { }

export const schema = new Schema<IAddress>(
  {
    entity: { type: Schema.Types.ObjectId, input: "SelectField" },
    name: { type: String, input: "TextField" },
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
    phone: { type: String, input: "TextField" },
    geoCodeHint: {
      type: String,
      get: (v: any) =>
        v ? `${v.address}, ${v.address2}, ${v.zip} ${v.city} ${v.country}` : '',
      input: "TextField"
    },
    latitude: { type: String, input: "TextField" },
    longitude: { type: String, input: "TextField" }
  },
  options
);
schema.method("geoCode", async function (geoCodeHint: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${geoCodeHint}&key=${process.env.GOOGLE_API_KEY}`
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
  if (!this.isModified("geoCodeHint")) return next();
  else {
    const coordinate = await this.geoCode(this.geoCodeHint || "");
    this.latitude = coordinate.latitude;
    this.longitude = coordinate.longitude;
  }
  next();
});

const Address: IAddressModel = model<IAddress, IAddressModel>("Address", schema);
export default Address;
