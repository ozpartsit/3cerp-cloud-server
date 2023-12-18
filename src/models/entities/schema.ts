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
  email2?: string;
  phone2?: string;
  locale?: string;
  currency?: string;
  taxNumber: string;
  taxRate: number;

  contacts?: IContact[];
  addresses?: IAddress[];

  memo?: string;
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IEntityModel extends Model<IEntity>, IExtendedModel<IEntity> { }

const options = {
  discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IEntity>(
  {
    email: { type: String, input: "Input", validType: "email", min: 3, max: 256 },
    phone: { type: String, input: "Input", validType: "phone", min: 6, max: 15 },
    email2: { type: String, input: "Input", validType: "email", min: 3, max: 256 },
    phone2: { type: String, input: "Input", validType: "phone", min: 6, max: 15 },
    name: {
      type: String,
      required: true,
      input: "Input",
      validType: "text",
      min: 3,
      max: 64
    },
    type: {
      type: String,
      required: true
    },
    locale: { type: String, default: "en" },
    currency: {
      type: String,
      required: true,
      input: "Autocomplete",
      validType: "select",
      constant: 'currency',
      hint: "Primary currency",
    },
    taxNumber: {
      type: String,
      input: "Input",
      validType: "text",
      min: 10,
      max: 14,
      hint: "VAT registration number",
      help: "Sometimes also known as a VAT registration number, this is the unique number that identifies a taxable person (business) or non-taxable legal entity that is registered for VAT."
    },
    taxRate: {
      type: Number,
      default: 0,
      input: "Input",
      validType: "percent",
      precision: 1,
      min: 0
    },
    memo: {
      type: String,
      input: "Textarea",
    },
  },
  options
);
schema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  sortable: true,
  editable: true,
  removable: true,
  addable: true,
  groupable: true,
  model: Address
});
schema.virtual("contacts", {
  ref: "Contact",
  localField: "_id",
  foreignField: "entity",
  justOne: false,
  autopopulate: true,
  sortable: true,
  editable: true,
  removable: true,
  addable: true,
  groupable: true,
  model: Contact
});


schema.index({ name: 1 });

const Entity: IEntityModel = model<IEntity, IEntityModel>(
  "Entity",
  schema
);
Entity.init().then(function (Event) {
  console.log('Entity Builded');
  Entity.updateMany({ type: "Customer" }, { $set: { type: "customer" } }).exec()
})
export default Entity;
