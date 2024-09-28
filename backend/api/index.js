import { app } from "../dist/app.js";
import mongoose from "mongoose";

export default async function handler(req, reply) {
  await app.ready();
  await mongoose.connect(process.env.MONGO_URI);
  app.server.emit("request", req, reply);
}
