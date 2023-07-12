import { Schema } from "mongoose";
import axios from "axios";
//import Countries from "../../constants/countries";
import { IEntity } from "./schema";
export interface IAddress {
  _id: Schema.Types.ObjectId;
  entity: IEntity["_id"];
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
  discriminatorKey: "entity",
  collection: "entities.addresses"
};
const schema = new Schema<IAddress>(
  {
    entity: { type: Schema.Types.ObjectId },
    name: { type: String, input: "TextField" },
    addressee: { type: String, input: "TextField" },
    address: { type: String, required: true, input: "TextField" },
    address2: { type: String, input: "TextField" },
    city: { type: String, required: true, input: "TextField" },
    zip: { type: String, required: true, input: "TextField" },
    country: {
      type: String,
      required: true,
      resource: "constatnts",
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
    const coordinate = await this.geoCode(this.geoCodeHint);
    this.latitude = coordinate.latitude;
    this.longitude = coordinate.longitude;
  }
  next();
});
export default schema;
