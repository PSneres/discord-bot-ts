import env from "#config/environment.js";
import mongoose from "mongoose";
import Logger from "../utils/system/logger.js";

export async function connectDatabase(logger: Logger) {
  mongoose.connection.on("connected", () => logger.info("MongoDB conected"));
  mongoose.connection.on("error", (err) => logger.error("Error in MongoDB:", err));
  mongoose.connection.on("disconnected", () => logger.warn("MongoDB desconected"));

  const db = await mongoose.connect(env.mongoUrl, {
    serverSelectionTimeoutMS: 5000, 
    maxPoolSize: 10,                
  });

  return db;
}

export default connectDatabase;