import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

export const connectToDB = async () => {
  try {
    if (typeof mongoUrl === "undefined") {
      throw new Error("MongoDB url is undefined");
    }
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.log(error);
  }
};
