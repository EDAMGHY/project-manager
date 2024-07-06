import mongoose, { SchemaDefinition, SchemaOptions } from "mongoose";
const { Schema } = mongoose;

const loggerSchema = new Schema(
  {
    action: {
      type: String,
      required: [true, "Please provide an action"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    role: {
      type: String,
      required: [true, "Please provide the user's role"],
    },

    ipAddress: {
      type: String,
      required: [true, "Please provide an IP address"],
    },
    method: {
      type: String,
      required: [true, "Please provide the HTTP method"],
    },
    endpoint: {
      type: String,
      required: [true, "Please provide the endpoint accessed"],
    },
    statusCode: {
      type: Number,
      required: [false, "Status code is optional"],
    },
    responseTime: {
      type: Number,
      required: [false, "Response time is optional"],
    },
    errorDetails: {
      type: String,
      required: [false, "Error details are optional"],
    },
    userAgent: {
      type: String,
      required: [false, "User agent is optional"],
    },
    payload: {
      type: Schema.Types.Mixed, // Use Mixed type for flexibility, but be cautious with sensitive data
      required: [false, "Payload is optional"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
  } as SchemaDefinition,
  { timestamps: true } as SchemaOptions,
);

export default mongoose.model("Logger", loggerSchema);
