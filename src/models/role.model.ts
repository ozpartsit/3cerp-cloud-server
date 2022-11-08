import { Schema, model } from "mongoose";

export interface IRole {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
  permissions: IPermissions[];
}
interface IPermissions {
  path: string;
  level: string;
}

const PermissionsSchema = {
  path: { type: String, required: true, input: "select" },
  level: {
    type: String,
    required: true,
    enum: ["edit", "view", "full"],
    default: "full",
    input: "select"
  }
};
const Permissions = new Schema<IPermissions>(PermissionsSchema);

export const schema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      min: [2, "Must be at least 2 characters long, got {VALUE}"]
    },
    type: {
      type: String,
      required: true,
      enum: ["role"],
      default: "role"
    },
    permissions: {
      type: [Permissions],
      validate: [
        {
          validator: (lines: any[]) => lines.length > 0,
          msg: "Must have minimum one line"
        },
        {
          validator: (lines: any[]) => lines.length < 500,
          msg: "Must have maximum 500 lines"
        }
      ]
    }
  },
  { collection: "roles" }
);
schema.index({ name: 1 });
export default model("Role", schema);
