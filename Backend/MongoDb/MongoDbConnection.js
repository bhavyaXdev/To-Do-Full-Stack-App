import mongoose from "mongoose";
const MongoDbUri  = process.env.MONGODB_URI

export const MongoDbConnection = (MongoDbUri) => {
  // MongoDB Connection
  mongoose.set("strictQuery", false);
  mongoose
    .connect(MongoDbUri)
    .then(() => console.log("Successfully connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB Atlas connection error:", err));
};
