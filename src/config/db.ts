import { env } from "@/lib";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected....`);
  } catch (err) {
    console.log(`MongoDB Error : ${err}`);
  }
};
