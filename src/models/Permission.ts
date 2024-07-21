import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a permission name"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a permission description"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Permission", permissionSchema);
