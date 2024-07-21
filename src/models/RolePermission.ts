import mongoose, { Schema, SchemaDefinition, SchemaOptions } from "mongoose";

const rolePermissionSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("RolePermission", rolePermissionSchema);
