import mongoose from "mongoose";

export async function connect() {
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  });
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  map_api_key: { type: String, required: false },
});

export const User = mongoose.model("User", userSchema);
