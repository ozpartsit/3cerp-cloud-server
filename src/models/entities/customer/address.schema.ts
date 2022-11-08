import { Schema } from "mongoose";
import axios from "axios";
import Countries from "../../../constants/countries";
import { IEntity } from "../schema";
export interface IAddress {
  _id: Schema.Types.ObjectId;
  entity: IEntity["_id"];
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
    addressee: { type: String, input: "text" },
    address: { type: String, required: true, input: "text" },
    address2: { type: String, input: "text" },
    city: { type: String, required: true, input: "text" },
    zip: { type: String, required: true, input: "text" },
    country: {
      type: String,
      //get: (v: any) => Countries.getName(v),
      enum: Countries,
      required: true,
      input: "select"
    },
    phone: { type: String, input: "text" },
    geoCodeHint: {
      type: String,
      get: (v: any) =>
        `${v.address}, ${v.address2}, ${v.zip} ${v.city} ${v.country}`,
      input: "text"
    },
    latitude: { type: String, input: "text" },
    longitude: { type: String, input: "text" }
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
