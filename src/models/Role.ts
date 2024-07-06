import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a role name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a role description"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Role", roleSchema);
