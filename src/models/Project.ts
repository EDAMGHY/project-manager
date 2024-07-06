import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Project", projectSchema);
