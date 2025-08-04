import mongoose from "mongoose";

let isConnected = false; // Prevent multiple connections

export async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);

    isConnected = !!db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error(error);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
}
