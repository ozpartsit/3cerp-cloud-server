import { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IEntity {
  _id: Schema.Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  type: string;
  email?: string;
  password?: string;
  validatePassword(password: string): boolean;
  hashPassword(): any;
}

// Schemas ////////////////////////////////////////////////////////////////////////////////
const SALT_WORK_FACTOR = 10;

const options = {
  discriminatorKey: "type", collection: "entities", toJSON: { virtuals: true },
  toObject: { virtuals: true }
};
const schema = new Schema<IEntity>(
  {
    email: { type: String, input: "text" },
    name: {
      type: String,
      required: true,
      min: [3, "Must be at least 3 characters long, got {VALUE}"],
      input: "text"
    },
    firstName: { type: String, input: "text" },
    lastName: { type: String, input: "text" },
    type: {
      type: String,
      required: true,
      enum: ["company", "customer", "vendor", "employee"],
      default: "customer",
      input: "select"
    },
    password: { type: String, input: "password" }
  },
  options
);
// Methods
schema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  return await bcrypt.hash(this.password, salt);
};

schema.method("validatePassword", async function (newPassword: string) {
  return await bcrypt.compare(newPassword, this.password);
});
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  else this.password = await this.hashPassword();
  next();
});
schema.index({ name: 1 });

export default schema;
