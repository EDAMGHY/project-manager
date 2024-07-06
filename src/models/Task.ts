import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a task name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a task description"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["started", "pending", "in progress", "completed"],
      default: "started",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Please provide a project id"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Task", taskSchema);
