import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error("Please add MONGO_URI to .env.local");

  return mongoose.connect(uri);
}
