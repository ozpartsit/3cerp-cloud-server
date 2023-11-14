import { Schema, model, Model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import Contact, { IContact } from "../contact.model";
import Address, { IAddress } from "../address.model";

export interface IEntity extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  locale?: string;
  currency?: string;
  taxNumber: string;
  tax: number;

  contacts?: IContact[];
  addresses?: IAddress[];

}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IEntityModel extends Model<IEntity>, IExtendedModel<IEntity> { }

const options = {
  discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IEntity>(
  {
    email: { type: String, input: "TextField", validType: "email" },
    phone: { type: String, input: "TextField", validType: "phone" },
    name: {
      type: String,
      required: true,
      input: "TextField",
      min: 3,
      max: 34
    },
    type: {
      type: String,
      required: true
    },
    locale: { type: String, default: "en" },
    currency: {
      type: String,
      required: true,
      input: "SelectField",
      constant: 'currencies',
      hint: "Primary currency",
    },
    taxNumber: {
      type: String,
      input: "TextField",
      min: 10,
      max: 14,
      hint: "VAT registration number",
      help: "Sometimes also known as a VAT registration number, this is the unique number that identifies a taxable person (business) or non-taxable legal entity that is registered for VAT."
    },
    tax: {
      type: Number,
      default: 0,
      input: "PercentField"
    }
  },
  options
);
schema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: Address
});
schema.virtual("contacts", {
  ref: "Contact",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  model: Contact
});


schema.index({ name: 1 });

const Entity: IEntityModel = model<IEntity, IEntityModel>(
  "Entity",
  schema
);
Entity.init().then(function (Event) {
  console.log('Entity Builded');
})
export default Entity;
