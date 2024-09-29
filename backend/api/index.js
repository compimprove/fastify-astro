import mongoose from "mongoose";

const app = Fastify({
  logger: true,
});

app.get("/", async (req, reply) => {
  return reply.send("Hello World");
});

export default async function handler(req, reply) {
  await app.ready();
  await mongoose.connect(process.env.MONGO_URI);
  app.server.emit("request", req, reply);
}
