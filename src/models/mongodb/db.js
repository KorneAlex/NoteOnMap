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
  points: { type: Array, required: false },
});

const pointSchema = new mongoose.Schema({
  owner: { type: String, required: true },
      time: {
        created: { type: String, required: true },
      },
  pos: {
    lat: { type: String, required: true },
    lon: { type: String, required: true },
  },
  data: {
    name: { type: String, required: true },
    description: { type: String, required: false },
    categories: { type: [String], default: [] }, // array of strings (AI help)
  },
});

// TODO: Categories
// TODO: Fix pointSchema

export const User = mongoose.model("User", userSchema);
export const Point = mongoose.model("Point", pointSchema);
