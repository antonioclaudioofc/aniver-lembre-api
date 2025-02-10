import z from "zod";
import { FastifyTypedInstance } from "./types";
import { randomUUID } from "node:crypto";
import { db } from "./firebase";

export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "List users",
      },
    },
    async () => {
      const snapshot = await db.collection("users").get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  );

  app.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a new user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;
      const id = randomUUID();

      await db.collection("users").doc(id).set({ name, email });
      return reply.status(201).send({ id, name, email });
    }
  );
}
