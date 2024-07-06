import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: { type: String, required: [true, "Please provide a password"] },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Please provide a role id"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("User", userSchema);
