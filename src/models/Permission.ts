import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a permission name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a permission description"],
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Please provide a role id"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Permission", permissionSchema);
