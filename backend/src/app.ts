import Fastify from "fastify";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";
import { User } from "./model/user.model";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

app.register(clerkPlugin);
app.register(cors);

app.get("/", async (req, reply) => {
  return reply.send("Hello World");
});

app.get("/user", async (req, reply) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return reply.code(401).send();
  }
  const user = await clerkClient.users.getUser(userId);
  const userData = await User.findOne({ userId });
  if (!userData) {
    const newUser = new User({ userId, userName: user.fullName });
    await newUser.save();
  }
  return reply.send({ userName: user.fullName });
});

export { app };
