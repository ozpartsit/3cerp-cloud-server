import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel, updateBody } from "../utilities/static";

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
  type: "address",
};

interface IAddressModel extends Model<IAddress>, IExtendedModel<IAddress> { }

//schema to shere
export const nestedSchema = {
  name: { type: String, required: true, input: "Input", validType: "text", min: 1, max: 256 },
  addressee: { type: String, input: "Input", validType: "text", min: 1, max: 256 },
  address: { type: String, required: true, input: "Input", validType: "text", min: 1, max: 256 },
  address2: { type: String, input: "Input", validType: "text", min: 1, max: 256 },
  city: { type: String, required: true, input: "Input", validType: "text", min: 1, max: 256 },
  zip: { type: String, required: true, input: "Input", validType: "text", min: 1, max: 256 },
  country: {
    type: String,
    required: true,
    constant: "country",
    input: "Select",
    validType: "select"
  },
  phone: { type: String, required: true, input: "Input", validType: "phone", min: 6, max: 15 },
  latitude: { type: String, input: "Input", readonly: true, validType: "number" },
  longitude: { type: String, input: "Input", readonly: true, validType: "number" }
}

export const schema = new Schema<IAddress>(
  {
    ...nestedSchema,
    entity: { type: Schema.Types.ObjectId },
    billingAddress: { type: Boolean, default: false, input: "Switch", validType: "switch" },
    shippingAddress: { type: Boolean, default: false, input: "Switch", validType: "switch" },
    geoCodeHint: {
      type: String,
      input: "Input",
      validType: "text"
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

//Przed zapisaniem aktualizuje wpsółrzędne
schema.pre("save", async function (next) {
  if (!this.geoCodeHint || this.isModified("zip") || this.isModified("city") || this.isModified("country"))
    this.geoCodeHint = `${this.zip} ${this.city} ${this.country}`;
  if (this.isModified("geoCodeHint") || !this.latitude || this.longitude) {
    const coordinate = await this.geoCode(this.geoCodeHint || "");
    if (coordinate && coordinate.latitude && coordinate.longitude) {
      this.latitude = coordinate.latitude;
      this.longitude = coordinate.longitude;
    }
  } else
    return next();
  next();
});

// po zapisaniu aktualizuje dokument klienta w którym ten adres jest użyty jako domyśłny
// schema.post("save", async function (next) {
//   if (this.entity) {
//     const parent = this.$parent();
//     if (!parent && (this.billingAddress || this.shippingAddress)) {
//       console.log("update address in parent");
//       const updates = Object.keys(nestedSchema).map(field => {
//         return { field: field, value: this[field] } as updateBody
//       })
//       await Entity.updateDocument(this.entity.toString(), "simple", updates)

//     }
//   }
// })

schema.methods.recalc = async function () {
  if (this.$locals.triggers) for (let trigger of this.$locals.triggers) {
    // if (trigger.type == "setValue") {
    //   if (this.shippingAddress) await updateDefaultAddress(this, trigger.field, "shippingAddress")
    //   if (this.billingAddress) await updateDefaultAddress(this, trigger.field, "billingAddress")
    // }
    this.$locals.triggers.shift();
  }
}

const Address: IAddressModel = model<IAddress, IAddressModel>("Address", schema);
export default Address;

//aktualizuje domyśne adresy w głownym dokumencie
async function updateDefaultAddress(doc, change, type) {
  const parent = doc.$parent() as IExtendedDocument;
  Object.keys(nestedSchema).forEach(async (field) => {
    if (field == change && parent) await parent.setValue(field, doc[field], type, null, null, null);
  })

}