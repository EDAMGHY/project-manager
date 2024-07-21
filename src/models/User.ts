import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
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
userSchema.pre("save", async function (this) {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
